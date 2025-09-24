import { NextRequest, NextResponse } from 'next/server';
import { createPaymentSession, PaymentSessionRequest } from '@/lib/cashfree-sdk';
import { z } from 'zod';

// Validation schema for payment session request
const PaymentSessionSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
  order_amount: z.number().positive('Order amount must be positive'),
  order_currency: z.string().default('INR'),
  customer_details: z.object({
    customer_id: z.string().min(1, 'Customer ID is required'),
    customer_name: z.string().min(1, 'Customer name is required'),
    customer_email: z.string().email('Valid email is required'),
    customer_phone: z.string().min(10, 'Valid phone number is required'),
  }),
  order_meta: z.object({
    return_url: z.string().url().optional(),
    notify_url: z.string().url().optional(),
    payment_methods: z.string().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    const validationResult = PaymentSessionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const sessionData: PaymentSessionRequest = validationResult.data;

    // Add default URLs if not provided
    if (!sessionData.order_meta) {
      sessionData.order_meta = {};
    }
    
    if (!sessionData.order_meta.return_url) {
      sessionData.order_meta.return_url = `${process.env.NEXT_PUBLIC_APP_URL}/donate/success?order_id=${sessionData.order_id}`;
    }
    
    if (!sessionData.order_meta.notify_url) {
      sessionData.order_meta.notify_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/cashfree`;
    }

    console.log('Creating payment session with Cashfree SDK:', {
      orderId: sessionData.order_id,
      amount: sessionData.order_amount,
      currency: sessionData.order_currency
    });

    // Create payment session using SDK
    const response = await createPaymentSession(sessionData);

    console.log('Payment session created successfully:', {
      orderId: response.order_id,
      sessionId: response.payment_session_id
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error creating payment session:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      if (error.message.includes('ORDER_ALREADY_EXISTS')) {
        return NextResponse.json(
          { error: 'Order ID already exists. Please use a different order ID.' },
          { status: 409 }
        );
      } else if (error.message.includes('INVALID_REQUEST')) {
        return NextResponse.json(
          { error: 'Invalid payment request. Please check your data.' },
          { status: 400 }
        );
      } else if (error.message.includes('AUTHENTICATION_FAILED')) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your credentials.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
