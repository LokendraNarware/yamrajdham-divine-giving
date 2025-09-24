import { NextRequest, NextResponse } from 'next/server';
import { CASHFREE_CONFIG } from '@/config/cashfree';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payment_session_id, payment_method } = body;
    
    if (!payment_session_id || !payment_method) {
      return NextResponse.json(
        { error: 'payment_session_id and payment_method are required' },
        { status: 400 }
      );
    }

    console.log('Processing payment via Order Pay API:', {
      sessionId: payment_session_id,
      paymentMethod: payment_method
    });

    // Prepare the request payload for Cashfree Order Pay API
    const cashfreePayload = {
      payment_session_id,
      payment_method,
    };

    // Make request to Cashfree Order Pay API
    const response = await fetch(`${CASHFREE_CONFIG.BASE_URL}/pg/orders/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-version': CASHFREE_CONFIG.API_VERSION,
        'x-client-id': CASHFREE_CONFIG.APP_ID,
        'x-client-secret': CASHFREE_CONFIG.SECRET_KEY,
      },
      body: JSON.stringify(cashfreePayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cashfree Order Pay API Error:', errorData);
      
      if (response.status === 400) {
        return NextResponse.json(
          { error: errorData.message || 'Invalid payment request', details: errorData.details },
          { status: 400 }
        );
      } else if (response.status === 401) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your credentials.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: errorData.message || `HTTP ${response.status}: Failed to process payment` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Payment processed successfully:', {
      cfPaymentId: data.cf_payment_id,
      paymentMethod: data.payment_method,
      action: data.action
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error processing payment:', error);
    
    return NextResponse.json(
      { error: `Failed to process payment: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
