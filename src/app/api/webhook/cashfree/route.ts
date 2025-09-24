import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyWebhookSignature, 
  parseWebhookPayload, 
  validateWebhookData, 
  extractWebhookSignature,
  logWebhookEvent 
} from '@/lib/webhook-verification';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get raw payload for signature verification
    const rawPayload = await request.text();
    
    // Extract signature from headers
    const signature = extractWebhookSignature(request.headers);
    
    if (!signature) {
      console.error('Webhook signature not found in headers');
      return NextResponse.json(
        { error: 'Webhook signature not found' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || 'your_webhook_secret_here';
    const isValidSignature = verifyWebhookSignature(rawPayload, signature, webhookSecret);
    
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse and validate webhook payload
    const webhookData = parseWebhookPayload(rawPayload);
    if (!webhookData) {
      console.error('Invalid webhook payload');
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    if (!validateWebhookData(webhookData)) {
      console.error('Invalid webhook data structure');
      return NextResponse.json(
        { error: 'Invalid webhook data structure' },
        { status: 400 }
      );
    }

    const { type, data } = webhookData;
    const { order, customer_details } = data;

    // Log webhook event
    logWebhookEvent(type, order.order_id, order.order_status);

    // Process webhook based on order status
    switch (order.order_status) {
      case 'PAID':
        await handleSuccessfulPayment(order, customer_details);
        break;
        
      case 'EXPIRED':
        await handleExpiredPayment(order, customer_details);
        break;
        
      case 'CANCELLED':
        await handleCancelledPayment(order, customer_details);
        break;
        
      case 'ACTIVE':
        await handleActivePayment(order, customer_details);
        break;
        
      default:
        console.log('Unhandled order status:', order.order_status);
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

/**
 * Handle successful payment
 */
async function handleSuccessfulPayment(order: any, customer_details: any) {
  try {
    console.log('Processing successful payment:', order.order_id);

    // Update donation status in database
    const { error: dbError } = await supabase
      .from('donations')
      .update({
        payment_status: 'completed',
        payment_id: order.payment_id,
        payment_gateway: 'cashfree',
        payment_method: order.payment_method,
        payment_utr: order.payment_utr,
        payment_time: order.payment_time,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', order.order_id);

    if (dbError) {
      console.error('Database update error:', dbError);
      throw dbError;
    }

    // Log successful payment
    console.log('Donation completed successfully:', {
      orderId: order.order_id,
      amount: order.order_amount,
      donorEmail: customer_details.customer_email,
      paymentMethod: order.payment_method,
      paymentId: order.payment_id
    });

    // TODO: Send confirmation email to donor
    // await sendDonationConfirmationEmail(customer_details.customer_email, order);

    // TODO: Send notification to admin
    // await sendAdminNotification(order, customer_details);

  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

/**
 * Handle expired payment
 */
async function handleExpiredPayment(order: any, customer_details: any) {
  try {
    console.log('Processing expired payment:', order.order_id);

    // Update donation status to expired
    const { error: dbError } = await supabase
      .from('donations')
      .update({
        payment_status: 'expired',
        payment_gateway: 'cashfree',
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', order.order_id);

    if (dbError) {
      console.error('Database update error:', dbError);
      throw dbError;
    }

    console.log('Payment expired:', order.order_id);

  } catch (error) {
    console.error('Error handling expired payment:', error);
    throw error;
  }
}

/**
 * Handle cancelled payment
 */
async function handleCancelledPayment(order: any, customer_details: any) {
  try {
    console.log('Processing cancelled payment:', order.order_id);

    // Update donation status to cancelled
    const { error: dbError } = await supabase
      .from('donations')
      .update({
        payment_status: 'cancelled',
        payment_gateway: 'cashfree',
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', order.order_id);

    if (dbError) {
      console.error('Database update error:', dbError);
      throw dbError;
    }

    console.log('Payment cancelled:', order.order_id);

  } catch (error) {
    console.error('Error handling cancelled payment:', error);
    throw error;
  }
}

/**
 * Handle active payment (payment initiated but not completed)
 */
async function handleActivePayment(order: any, customer_details: any) {
  try {
    console.log('Processing active payment:', order.order_id);

    // Update donation status to pending
    const { error: dbError } = await supabase
      .from('donations')
      .update({
        payment_status: 'pending',
        payment_gateway: 'cashfree',
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', order.order_id);

    if (dbError) {
      console.error('Database update error:', dbError);
      throw dbError;
    }

    console.log('Payment active:', order.order_id);

  } catch (error) {
    console.error('Error handling active payment:', error);
    throw error;
  }
}
