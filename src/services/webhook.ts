// Webhook handler for Cashfree payment notifications
// This would typically be implemented on your backend server

export interface CashfreeWebhookData {
  type: string;
  data: {
    order: {
      order_id: string;
      order_amount: number;
      order_currency: string;
      order_status: string;
      payment_status: string;
      payment_time?: string;
      payment_method?: string;
      payment_id?: string;
      payment_utr?: string;
      payment_message?: string;
    };
    customer_details: {
      customer_id: string;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
    };
  };
}

export const handleCashfreeWebhook = async (webhookData: CashfreeWebhookData) => {
  try {
    const { order, customer_details } = webhookData.data;
    
    console.log('Processing webhook for order:', order.order_id, 'Status:', order.order_status);
    
    // Update donation status in database based on order status
    if (order.order_status === 'PAID') {
      console.log('Donation successful for order:', order.order_id);
      
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
    
    return { success: true };
  } catch (error) {
    console.error('Webhook processing error:', error);
    return { success: false, error };
  }
};

// Verify webhook signature (implement based on Cashfree documentation)
export const verifyWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  // Implement signature verification logic using HMAC SHA256
  // This is important for security to ensure the webhook is from Cashfree
  
  try {
    // In a real implementation, you would use crypto.createHmac('sha256', secret)
    // to verify the signature matches the payload
    // For now, we'll return true for development
    console.log('Verifying webhook signature...');
    return true; // Placeholder - implement actual verification
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};

// Webhook endpoint handler (for backend implementation)
export const webhookHandler = async (req: any, res: any) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, process.env.CASHFREE_WEBHOOK_SECRET || '')) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process the webhook
    const result = await handleCashfreeWebhook(req.body);
    
    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
