import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Check if donation exists in database
    // We pass donation.id as orderId in our flow; fall back to payment_id if needed
    let donation: any;
    let error: any;
    ({ data: donation, error } = await (supabase
      .from('user_donations')
      .select('*')
      .eq('id', orderId)
      .single() as any));

    if ((error || !donation)) {
      // Try by payment_id as a fallback
      const fallback = await (supabase
        .from('user_donations')
        .select('*')
        .eq('payment_id', orderId)
        .single() as any);
      donation = fallback.data;
      error = fallback.error;
    }

    if (error || !donation) {
      console.error('Error fetching donation:', error);
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Check if we recently verified this payment (within last 5 minutes)
    const now = new Date();
    const lastVerified = donation.last_verified_at ? new Date(donation.last_verified_at) : null;
    const shouldSkipVerification = lastVerified && 
      (now.getTime() - lastVerified.getTime()) < 5 * 60 * 1000; // 5 minutes

    // Attempt real verification from Cashfree Orders API when credentials are present
    const APP_ID = process.env.CASHFREE_APP_ID;
    const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
    const ENVIRONMENT = (process.env.CASHFREE_ENVIRONMENT || 'sandbox').toLowerCase();

    let orderStatus: 'PAID' | 'ACTIVE' | 'EXPIRED' | 'FAILED' | 'UNKNOWN' = 'UNKNOWN';
    let paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED' | 'NOT_ATTEMPTED' | 'CANCELLED' | 'VOID' | 'UNKNOWN' = 'UNKNOWN';
    let paymentMethod: string | undefined;
    let paymentTime: string | undefined;

    // Skip external API calls if we recently verified and payment is completed
    if (APP_ID && SECRET_KEY && !shouldSkipVerification) {
      try {
        const baseUrl = ENVIRONMENT === 'production' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';
        
        // Use Promise.all to fetch both order and payment data in parallel with timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Cashfree API timeout')), 8000)
        );
        
        const fetchPromise = Promise.all([
          fetch(`${baseUrl}/pg/orders/${encodeURIComponent(orderId!)}`, {
            headers: {
              'x-client-id': APP_ID,
              'x-client-secret': SECRET_KEY,
              'x-api-version': '2023-08-01',
              'accept': 'application/json'
            },
            cache: 'no-store'
          }),
          fetch(`${baseUrl}/pg/orders/${encodeURIComponent(orderId!)}/payments`, {
            headers: {
              'x-client-id': APP_ID,
              'x-client-secret': SECRET_KEY,
              'x-api-version': '2023-08-01',
              'accept': 'application/json'
            },
            cache: 'no-store'
          })
        ]);

        const [orderRes, paymentsRes] = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]) as [Response, Response];

        if (orderRes.ok) {
          const orderJson = await orderRes.json();
          orderStatus = (orderJson.order_status as typeof orderStatus) || 'UNKNOWN';
        }

        if (paymentsRes.ok) {
          const paymentsJson = await paymentsRes.json();
          const latest = Array.isArray(paymentsJson) ? paymentsJson[0] : undefined;
          if (latest) {
            paymentStatus = (latest.payment_status as typeof paymentStatus) || 'UNKNOWN';
            // Normalize payment_method which can be an object like { upi: {...} }
            const rawMethod = latest.payment_method || latest.payment_group;
            if (rawMethod && typeof rawMethod === 'object') {
              const keys = Object.keys(rawMethod);
              paymentMethod = keys.length ? keys[0] : 'Online Payment';
            } else if (typeof rawMethod === 'string') {
              paymentMethod = rawMethod;
            } else {
              paymentMethod = 'Online Payment';
            }
            paymentTime = latest.payment_time || latest.created_at;
          }
        }
      } catch (err) {
        console.error('Cashfree verification failed, falling back to DB status:', err);
      }
    } else if (shouldSkipVerification) {
      console.log('Skipping Cashfree verification - recently verified');
    }

    // Map gateway statuses to DB enum: pending | completed | failed | refunded
    const mapToDbStatus = (
      pgPaymentStatus: typeof paymentStatus,
      pgOrderStatus: typeof orderStatus,
      currentDb: string
    ): 'pending' | 'completed' | 'failed' | 'refunded' => {
      // Primary mapping from payment status
      switch (pgPaymentStatus) {
        case 'SUCCESS':
          return 'completed';
        case 'FAILED':
        case 'CANCELLED':
        case 'VOID':
          return 'failed';
        case 'NOT_ATTEMPTED':
        case 'PENDING':
        case 'UNKNOWN':
          break; // fall back to order status / current DB
      }
      // Fallback mapping from order status
      switch (pgOrderStatus) {
        case 'PAID':
          return 'completed';
        case 'ACTIVE':
          return 'pending';
        case 'EXPIRED':
        case 'FAILED':
          return 'failed';
        default:
          break;
      }
      // If nothing conclusive, keep current DB value
      if (currentDb === 'completed' || currentDb === 'failed' || currentDb === 'refunded') {
        return currentDb as any;
      }
      return 'pending';
    };

    const dbStatus = mapToDbStatus(paymentStatus, orderStatus, donation.payment_status);
    const isPaid = dbStatus === 'completed';

    // Persist status if changed or update verification timestamp
    const updateData: any = { last_verified_at: now.toISOString() };
    if (dbStatus !== donation.payment_status) {
      updateData.payment_status = dbStatus;
      donation.payment_status = dbStatus;
    }
    
    await (supabase
      .from('user_donations') as any)
      .update(updateData)
      .eq('id', donation.id);

    // Determine if this is a mock/test order (when credentials not configured)
    const isMockOrder = !APP_ID || !SECRET_KEY || 
                       APP_ID === 'your_app_id_here' || 
                       SECRET_KEY === 'your_secret_key_here';

    // Return verification response (prefer Cashfree data when present)
    const verificationResponse = {
      order_id: orderId,
      order_amount: donation.amount,
      order_status: isPaid ? 'PAID' : (isMockOrder ? 'MOCK_UNPAID' : (orderStatus === 'UNKNOWN' ? 'ACTIVE' : orderStatus)),
      payment_status: isPaid ? 'SUCCESS' : (isMockOrder ? 'MOCK_UNPAID' : (paymentStatus === 'UNKNOWN' ? 'PENDING' : paymentStatus)),
      payment_method: paymentMethod || donation.payment_gateway || 'Online Payment',
      payment_time: paymentTime || donation.updated_at,
      success: true,
      is_mock: isMockOrder
    };

    return NextResponse.json(verificationResponse);
  } catch (error) {
    console.error('Error in payment verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
