import { NextRequest, NextResponse } from 'next/server';
import { CASHFREE_CONFIG } from '@/config/cashfree';
import { supabase } from '@/integrations/supabase/client';

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
  
  console.log('✅ Payment successful:', {
    orderId: order.order_id,
    amount: order.order_amount,
    paymentId: payment.payment_id,
    paymentMethod: payment.payment_method
  });

  try {
    // Update donation status in database
    const { data: updatedDonation, error } = await supabase
      .from('user_donations')
      .update({
        payment_status: 'completed',
        payment_id: payment.payment_id,
        payment_gateway: 'cashfree',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.order_id) // order_id is the donation id
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating donation status:', error);
    } else {
      console.log('✅ Donation status updated successfully:', updatedDonation);
    }
  } catch (error) {
    console.error('❌ Error in handlePaymentSuccess:', error);
  }
}

async function handlePaymentFailed(data: any) {
  const order = data.order;
  const payment = data.payment;
  
  console.log('❌ Payment failed:', {
    orderId: order.order_id,
    amount: order.order_amount,
    failureReason: payment.payment_message
  });

  try {
    // Update donation status in database
    const { data: updatedDonation, error } = await supabase
      .from('user_donations')
      .update({
        payment_status: 'failed',
        payment_id: payment.payment_id || null,
        payment_gateway: 'cashfree',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.order_id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating donation status:', error);
    } else {
      console.log('✅ Donation status updated to failed:', updatedDonation);
    }
  } catch (error) {
    console.error('❌ Error in handlePaymentFailed:', error);
  }
}

async function handlePaymentDropped(data: any) {
  const order = data.order;
  
  console.log('⚠️ Payment dropped by user:', {
    orderId: order.order_id,
    amount: order.order_amount
  });

  try {
    // Update donation status in database
    const { data: updatedDonation, error } = await supabase
      .from('user_donations')
      .update({
        payment_status: 'pending', // Keep as pending since user can retry
        updated_at: new Date().toISOString()
      })
      .eq('id', order.order_id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating donation status:', error);
    } else {
      console.log('✅ Donation status updated (dropped):', updatedDonation);
    }
  } catch (error) {
    console.error('❌ Error in handlePaymentDropped:', error);
  }
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
