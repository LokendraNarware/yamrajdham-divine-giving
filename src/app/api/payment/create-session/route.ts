import { NextRequest, NextResponse } from 'next/server';
import { CASHFREE_CONFIG } from '@/config/cashfree';
import { PaymentSessionDataSchema } from '@/services/cashfree';
import { OrdersApi } from 'cashfree-pg-sdk-nodejs';

// Format phone number for Cashfree API
const formatPhoneForCashfree = (phone: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it starts with +91, keep it as is
  if (cleaned.startsWith('+91')) {
    return cleaned;
  }
  
  // If it starts with 91, add +
  if (cleaned.startsWith('91')) {
    return '+' + cleaned;
  }
  
  // If it's a 10-digit number, add +91
  if (cleaned.length === 10) {
    return '+91' + cleaned;
  }
  
  // Return as is if it doesn't match expected patterns
  return cleaned;
};

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

    // Format phone number for Cashfree API
    const originalPhone = validatedData.customer_details.customer_phone;
    const formattedPhone = formatPhoneForCashfree(originalPhone);
    
    console.log('Phone formatting:', {
      original: originalPhone,
      formatted: formattedPhone,
    });
    
    const formattedCustomerDetails = {
      ...validatedData.customer_details,
      customer_phone: formattedPhone,
    };

    // Configure order request as per Medium article
    const orderRequest = {
      order_amount: validatedData.order_amount,
      order_currency: validatedData.order_currency,
      order_id: validatedData.order_id,
      customer_details: formattedCustomerDetails,
      order_meta: validatedData.order_meta,
    };

    console.log('Creating order with Cashfree SDK:', JSON.stringify(orderRequest, null, 2));

    // Make request to Cashfree Create Order API directly (fallback approach)
    const response = await fetch(`${CASHFREE_CONFIG.BASE_URL}/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-version': CASHFREE_CONFIG.API_VERSION,
        'x-client-id': CASHFREE_CONFIG.APP_ID,
        'x-client-secret': CASHFREE_CONFIG.SECRET_KEY,
      },
      body: JSON.stringify(orderRequest),
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
    
    console.log('Raw Cashfree API response:', JSON.stringify(data, null, 2));
    console.log('Payment session created successfully:', {
      orderId: data.order_id,
      sessionId: data.payment_session_id,
      paymentUrl: data.payment_url
    });

    // Clean up session ID (remove any duplicate text at the end)
    let cleanSessionId = data.payment_session_id;
    if (cleanSessionId && cleanSessionId.endsWith('paymentpayment')) {
      cleanSessionId = cleanSessionId.replace('paymentpayment', '');
      console.log('Cleaned session ID:', cleanSessionId);
    }
    
    // Construct payment URL if not provided by Cashfree
    const paymentUrl = data.payment_url || `${CASHFREE_CONFIG.BASE_URL}/pg/view/sessions/checkout/${cleanSessionId}`;
    
    console.log('Constructed payment URL:', paymentUrl);
    console.log('Final session ID:', cleanSessionId);

    return NextResponse.json({
      success: true,
      message: "Order created successfully!",
      data: {
        payment_session_id: cleanSessionId,
        order_id: data.order_id,
        payment_url: paymentUrl,
        cf_order_id: data.cf_order_id,
      }
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
      { 
        success: false,
        message: error?.response?.data?.message || "Error processing the request.",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
