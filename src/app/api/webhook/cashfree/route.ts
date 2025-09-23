import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Processing Cashfree webhook:', body);
    
    const { order, customer_details } = body.data;
    
    // Update donation status in database based on order status
    if (order.order_status === 'PAID') {
      console.log('Payment successful for order:', order.order_id);
      
      // Here you would update your database with the payment details
      // Example: await updateDonationPayment(order.order_id, {
      //   payment_status: 'completed',
      //   payment_id: order.payment_id,
      //   payment_gateway: 'cashfree',
      //   payment_method: order.payment_method,
      //   payment_utr: order.payment_utr,
      //   payment_time: order.payment_time,
      // });
      
      // Send confirmation email to donor
      // Example: await sendDonationConfirmationEmail(customer_details.customer_email, order);
      
      // Log successful payment
      console.log('Donation completed:', {
        orderId: order.order_id,
        amount: order.order_amount,
        donorEmail: customer_details.customer_email,
        paymentMethod: order.payment_method
      });
      
    } else if (order.order_status === 'EXPIRED') {
      console.log('Payment expired for order:', order.order_id);
      
      // Update donation status to expired/failed
      // Example: await updateDonationPayment(order.order_id, {
      //   payment_status: 'expired',
      //   payment_gateway: 'cashfree',
      // });
      
    } else if (order.order_status === 'CANCELLED') {
      console.log('Payment cancelled for order:', order.order_id);
      
      // Update donation status to cancelled
      // Example: await updateDonationPayment(order.order_id, {
      //   payment_status: 'cancelled',
      //   payment_gateway: 'cashfree',
      // });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
