import { NextRequest, NextResponse } from 'next/server';
import { CASHFREE_CONFIG } from '@/config/cashfree';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Creating payment session with Cashfree:', {
      appId: CASHFREE_CONFIG.APP_ID,
      environment: CASHFREE_CONFIG.ENVIRONMENT,
      baseUrl: CASHFREE_CONFIG.BASE_URL
    });

    const response = await fetch(`${CASHFREE_CONFIG.BASE_URL}/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_CONFIG.APP_ID,
        'x-client-secret': CASHFREE_CONFIG.SECRET_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cashfree API Error:', errorData);
      return NextResponse.json(
        { error: errorData.message || `HTTP ${response.status}: Failed to create payment session` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Payment session created successfully:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating payment session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
