import { NextRequest, NextResponse } from 'next/server';
import { CASHFREE_CONFIG } from '@/config/cashfree';
import { PaymentSessionDataSchema } from '@/services/cashfree';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validatedData = PaymentSessionDataSchema.parse(body);
    
    console.log('Creating payment session:', {
      orderId: validatedData.order_id,
      amount: validatedData.order_amount,
      environment: CASHFREE_CONFIG.ENVIRONMENT
    });

    // Prepare the request payload for Cashfree API
    const cashfreePayload = {
      order_id: validatedData.order_id,
      order_amount: validatedData.order_amount,
      order_currency: validatedData.order_currency,
      customer_details: validatedData.customer_details,
      order_meta: validatedData.order_meta,
    };

    // Make request to Cashfree API
    const response = await fetch(`${CASHFREE_CONFIG.BASE_URL}/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_CONFIG.APP_ID,
        'x-client-secret': CASHFREE_CONFIG.SECRET_KEY,
      },
      body: JSON.stringify(cashfreePayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cashfree API Error:', errorData);
      
      // Handle specific error cases
      if (response.status === 409) {
        return NextResponse.json(
          { error: 'Order ID already exists. Please use a different order ID.' },
          { status: 409 }
        );
      } else if (response.status === 400) {
        return NextResponse.json(
          { error: errorData.message || 'Invalid request data', details: errorData.details },
          { status: 400 }
        );
      } else if (response.status === 401) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your credentials.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: errorData.message || `HTTP ${response.status}: Failed to create payment session` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Payment session created successfully:', {
      orderId: data.order_id,
      sessionId: data.payment_session_id
    });

    return NextResponse.json({
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
      payment_url: data.payment_url,
    });

  } catch (error) {
    console.error('Error creating payment session:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: JSON.parse(error.message) },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to create payment session: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
