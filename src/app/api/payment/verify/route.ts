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
    let { data: donation, error } = await supabase
      .from('user_donations')
      .select('*')
      .eq('id', orderId)
      .single();

    if ((error || !donation)) {
      // Try by payment_id as a fallback
      const fallback = await supabase
        .from('user_donations')
        .select('*')
        .eq('payment_id', orderId)
        .single();
      donation = fallback.data as any;
      error = fallback.error as any;
    }

    if (error || !donation) {
      console.error('Error fetching donation:', error);
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Attempt real verification from Cashfree Orders API when credentials are present
    const APP_ID = process.env.CASHFREE_APP_ID;
    const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
    const ENVIRONMENT = (process.env.CASHFREE_ENVIRONMENT || 'sandbox').toLowerCase();

    let orderStatus: 'PAID' | 'ACTIVE' | 'EXPIRED' | 'FAILED' | 'UNKNOWN' = 'UNKNOWN';
    let paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED' | 'UNKNOWN' = 'UNKNOWN';
    let paymentMethod: string | undefined;
    let paymentTime: string | undefined;

    if (APP_ID && SECRET_KEY) {
      try {
        const baseUrl = ENVIRONMENT === 'production' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';
        // Fetch order details
        const orderRes = await fetch(`${baseUrl}/pg/orders/${encodeURIComponent(orderId!)}`, {
          headers: {
            'x-client-id': APP_ID,
            'x-client-secret': SECRET_KEY,
            'x-api-version': '2023-08-01',
            'accept': 'application/json'
          },
          cache: 'no-store'
        });

        if (orderRes.ok) {
          const orderJson = await orderRes.json();
          orderStatus = (orderJson.order_status as typeof orderStatus) || 'UNKNOWN';
        }

        // Fetch latest payment details for the order
        const paymentsRes = await fetch(`${baseUrl}/pg/orders/${encodeURIComponent(orderId!)}/payments`, {
          headers: {
            'x-client-id': APP_ID,
            'x-client-secret': SECRET_KEY,
            'x-api-version': '2023-08-01',
            'accept': 'application/json'
          },
          cache: 'no-store'
        });

        if (paymentsRes.ok) {
          const paymentsJson = await paymentsRes.json();
          const latest = Array.isArray(paymentsJson) ? paymentsJson[0] : undefined;
          if (latest) {
            paymentStatus = (latest.payment_status as typeof paymentStatus) || 'UNKNOWN';
            paymentMethod = latest.payment_method || latest.payment_group;
            paymentTime = latest.payment_time || latest.created_at;
          }
        }
      } catch (err) {
        console.error('Cashfree verification failed, falling back to DB status:', err);
      }
    }

    // Determine final status: prefer Cashfree if available, otherwise DB
    const isPaid = orderStatus === 'PAID' || paymentStatus === 'SUCCESS' || donation.payment_status === 'completed';

    // Persist status if changed
    if (isPaid && donation.payment_status !== 'completed') {
      await supabase
        .from('user_donations')
        .update({ payment_status: 'completed' })
        .eq('id', donation.id);
      donation.payment_status = 'completed';
    }

    // Return verification response (prefer Cashfree data when present)
    const verificationResponse = {
      order_id: orderId,
      order_amount: donation.amount,
      order_status: isPaid ? 'PAID' : (orderStatus === 'UNKNOWN' ? 'ACTIVE' : orderStatus),
      payment_status: isPaid ? 'SUCCESS' : (paymentStatus === 'UNKNOWN' ? 'PENDING' : paymentStatus),
      payment_method: paymentMethod || donation.payment_gateway || 'Online Payment',
      payment_time: paymentTime || donation.updated_at,
      success: true
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
