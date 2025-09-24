import { NextRequest, NextResponse } from 'next/server';
import { CASHFREE_CONFIG } from '@/config/cashfree';

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

    console.log('Verifying payment for order:', orderId);

    // Make request to Cashfree API to get order details
    const response = await fetch(`${CASHFREE_CONFIG.BASE_URL}/pg/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-version': CASHFREE_CONFIG.API_VERSION,
        'x-client-id': CASHFREE_CONFIG.APP_ID,
        'x-client-secret': CASHFREE_CONFIG.SECRET_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cashfree API Error:', errorData);
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Order not found. Please check the order ID.' },
          { status: 404 }
        );
      } else if (response.status === 401) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your credentials.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: errorData.message || `HTTP ${response.status}: Failed to verify payment` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Payment verification successful:', {
      orderId: data.order_id,
      status: data.order_status,
      paymentStatus: data.payment_status
    });

    return NextResponse.json({
      order_id: data.order_id,
      order_amount: data.order_amount,
      order_currency: data.order_currency,
      order_status: data.order_status,
      payment_status: data.payment_status,
      payment_method: data.payment_method,
      payment_time: data.payment_time,
      payment_id: data.payment_id,
      payment_utr: data.payment_utr,
      customer_details: data.customer_details,
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    
    return NextResponse.json(
      { error: `Failed to verify payment: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
