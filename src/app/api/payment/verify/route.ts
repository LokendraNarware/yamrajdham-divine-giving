import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment, getOrderDetails } from '@/lib/cashfree-sdk';
import { z } from 'zod';

// Validation schema for order ID
const OrderIdSchema = z.string().min(1, 'Order ID is required');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    // Validate order ID
    const validationResult = OrderIdSchema.safeParse(orderId);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const validOrderId = validationResult.data;

    console.log('Verifying payment for order:', validOrderId);

    // Verify payment using SDK
    const paymentDetails = await verifyPayment(validOrderId);

    console.log('Payment verification successful:', {
      orderId: paymentDetails.order_id,
      status: paymentDetails.order_status,
      paymentStatus: paymentDetails.payment_status
    });

    return NextResponse.json(paymentDetails);

  } catch (error) {
    console.error('Error verifying payment:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      if (error.message.includes('ORDER_NOT_FOUND')) {
        return NextResponse.json(
          { error: 'Order not found. Please check the order ID.' },
          { status: 404 }
        );
      } else if (error.message.includes('AUTHENTICATION_FAILED')) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your credentials.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

// Also support POST for order details
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    // Validate order ID
    const validationResult = OrderIdSchema.safeParse(orderId);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const validOrderId = validationResult.data;

    console.log('Fetching order details for:', validOrderId);

    // Get order details using SDK
    const orderDetails = await getOrderDetails(validOrderId);

    console.log('Order details fetched successfully:', {
      orderId: orderDetails.order_id,
      status: orderDetails.order_status
    });

    return NextResponse.json(orderDetails);

  } catch (error) {
    console.error('Error fetching order details:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      if (error.message.includes('ORDER_NOT_FOUND')) {
        return NextResponse.json(
          { error: 'Order not found. Please check the order ID.' },
          { status: 404 }
        );
      } else if (error.message.includes('AUTHENTICATION_FAILED')) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your credentials.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
