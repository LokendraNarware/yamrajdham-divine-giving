import { NextRequest, NextResponse } from 'next/server';
import { CASHFREE_CONFIG } from '@/config/cashfree';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Received Cashfree webhook:', {
      type: body.type,
      orderId: body.data?.order?.order_id,
      paymentStatus: body.data?.payment?.payment_status
    });

    // Verify webhook signature (optional but recommended for production)
    const signature = request.headers.get('x-webhook-signature');
    if (signature && !verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Handle different webhook types
    switch (body.type) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
        await handlePaymentSuccess(body.data);
        break;
      case 'PAYMENT_FAILED_WEBHOOK':
        await handlePaymentFailed(body.data);
        break;
      case 'PAYMENT_USER_DROPPED_WEBHOOK':
        await handlePaymentDropped(body.data);
        break;
      default:
        console.log('Unhandled webhook type:', body.type);
    }

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(data: any) {
  const order = data.order;
  const payment = data.payment;
  
  console.log('Payment successful:', {
    orderId: order.order_id,
    amount: order.order_amount,
    paymentId: payment.payment_id,
    paymentMethod: payment.payment_method
  });

  // Here you can:
  // 1. Update your database with payment success
  // 2. Send confirmation email to donor
  // 3. Update donation records
  // 4. Trigger any other business logic
  
  // Example: Update donation status in database
  // await updateDonationStatus(order.order_id, 'completed', payment);
}

async function handlePaymentFailed(data: any) {
  const order = data.order;
  const payment = data.payment;
  
  console.log('Payment failed:', {
    orderId: order.order_id,
    amount: order.order_amount,
    failureReason: payment.payment_message
  });

  // Here you can:
  // 1. Update your database with payment failure
  // 2. Send notification to donor about failure
  // 3. Log the failure for analysis
  
  // Example: Update donation status in database
  // await updateDonationStatus(order.order_id, 'failed', payment);
}

async function handlePaymentDropped(data: any) {
  const order = data.order;
  
  console.log('Payment dropped by user:', {
    orderId: order.order_id,
    amount: order.order_amount
  });

  // Here you can:
  // 1. Update your database with payment dropped
  // 2. Send follow-up email to donor
  // 3. Track abandonment for analytics
  
  // Example: Update donation status in database
  // await updateDonationStatus(order.order_id, 'abandoned', null);
}

function verifyWebhookSignature(body: any, signature: string): boolean {
  // Implement webhook signature verification
  // This is important for production to ensure webhooks are from Cashfree
  // For now, we'll return true (skip verification in development)
  // In production, you should implement proper signature verification
  
  if (CASHFREE_CONFIG.ENVIRONMENT === 'sandbox') {
    return true; // Skip verification in sandbox
  }
  
  // TODO: Implement proper signature verification for production
  // const expectedSignature = crypto
  //   .createHmac('sha256', CASHFREE_CONFIG.WEBHOOK_SECRET)
  //   .update(JSON.stringify(body))
  //   .digest('hex');
  // 
  // return signature === expectedSignature;
  
  return true;
}
