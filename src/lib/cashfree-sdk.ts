import { Cashfree } from 'cashfree-pg-sdk-nodejs';
import { CASHFREE_CONFIG } from '@/config/cashfree';

// Initialize Cashfree SDK with configuration
const cashfree = new Cashfree({
  apiVersion: '2023-08-01',
  secretKey: CASHFREE_CONFIG.SECRET_KEY,
  clientId: CASHFREE_CONFIG.APP_ID,
  environment: CASHFREE_CONFIG.ENVIRONMENT === 'production' ? 'PRODUCTION' : 'SANDBOX',
});

// Types for better type safety
export interface CustomerDetails {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export interface OrderMeta {
  return_url?: string;
  notify_url?: string;
  payment_methods?: string;
}

export interface PaymentSessionRequest {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: CustomerDetails;
  order_meta?: OrderMeta;
}

export interface PaymentSessionResponse {
  payment_session_id: string;
  order_id: string;
  payment_url: string;
}

export interface OrderDetails {
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: string;
  payment_status?: string;
  payment_method?: string;
  payment_time?: string;
  payment_id?: string;
  payment_utr?: string;
  customer_details: CustomerDetails;
}

export interface PaymentVerificationResponse {
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: string;
  payment_status?: string;
  payment_method?: string;
  payment_time?: string;
  payment_id?: string;
  payment_utr?: string;
  customer_details: CustomerDetails;
}

/**
 * Create a payment session using Cashfree SDK
 * @param sessionData - Payment session data
 * @returns Promise<PaymentSessionResponse>
 */
export async function createPaymentSession(sessionData: PaymentSessionRequest): Promise<PaymentSessionResponse> {
  try {
    console.log('Creating payment session with Cashfree SDK:', {
      orderId: sessionData.order_id,
      amount: sessionData.order_amount,
      environment: CASHFREE_CONFIG.ENVIRONMENT
    });

    // Validate required fields
    if (!sessionData.order_id || !sessionData.order_amount || !sessionData.customer_details) {
      throw new Error('Missing required fields: order_id, order_amount, or customer_details');
    }

    // Validate customer details
    const { customer_details } = sessionData;
    if (!customer_details.customer_id || !customer_details.customer_name || 
        !customer_details.customer_email || !customer_details.customer_phone) {
      throw new Error('Missing required customer details');
    }

    // Create order using Cashfree SDK
    const orderRequest = {
      order_id: sessionData.order_id,
      order_amount: sessionData.order_amount,
      order_currency: sessionData.order_currency || 'INR',
      customer_details: {
        customer_id: customer_details.customer_id,
        customer_name: customer_details.customer_name,
        customer_email: customer_details.customer_email,
        customer_phone: customer_details.customer_phone,
      },
      order_meta: sessionData.order_meta || {},
    };

    const response = await cashfree.PGCreateOrder('2023-08-01', orderRequest);

    if (!response || !response.payment_session_id) {
      throw new Error('Failed to create payment session - invalid response from Cashfree');
    }

    console.log('Payment session created successfully:', {
      orderId: response.order_id,
      sessionId: response.payment_session_id
    });

    return {
      payment_session_id: response.payment_session_id,
      order_id: response.order_id,
      payment_url: response.payment_url,
    };

  } catch (error) {
    console.error('Error creating payment session:', error);
    
    // Handle specific Cashfree errors
    if (error instanceof Error) {
      if (error.message.includes('INVALID_REQUEST')) {
        throw new Error('Invalid payment request. Please check your data.');
      } else if (error.message.includes('AUTHENTICATION_FAILED')) {
        throw new Error('Authentication failed. Please check your credentials.');
      } else if (error.message.includes('ORDER_ALREADY_EXISTS')) {
        throw new Error('Order ID already exists. Please use a different order ID.');
      }
    }
    
    throw new Error(`Failed to create payment session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get order details using Cashfree SDK
 * @param orderId - Order ID to fetch details for
 * @returns Promise<OrderDetails>
 */
export async function getOrderDetails(orderId: string): Promise<OrderDetails> {
  try {
    console.log('Fetching order details for:', orderId);

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    const response = await cashfree.PGOrderFetchPayments('2023-08-01', orderId);

    if (!response) {
      throw new Error('Failed to fetch order details - invalid response from Cashfree');
    }

    console.log('Order details fetched successfully:', {
      orderId: response.order_id,
      status: response.order_status
    });

    return {
      order_id: response.order_id,
      order_amount: response.order_amount,
      order_currency: response.order_currency,
      order_status: response.order_status,
      payment_status: response.payment_status,
      payment_method: response.payment_method,
      payment_time: response.payment_time,
      payment_id: response.payment_id,
      payment_utr: response.payment_utr,
      customer_details: response.customer_details,
    };

  } catch (error) {
    console.error('Error fetching order details:', error);
    
    // Handle specific Cashfree errors
    if (error instanceof Error) {
      if (error.message.includes('ORDER_NOT_FOUND')) {
        throw new Error('Order not found. Please check the order ID.');
      } else if (error.message.includes('AUTHENTICATION_FAILED')) {
        throw new Error('Authentication failed. Please check your credentials.');
      }
    }
    
    throw new Error(`Failed to fetch order details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify payment status using Cashfree SDK
 * @param orderId - Order ID to verify
 * @returns Promise<PaymentVerificationResponse>
 */
export async function verifyPayment(orderId: string): Promise<PaymentVerificationResponse> {
  try {
    console.log('Verifying payment for order:', orderId);

    const orderDetails = await getOrderDetails(orderId);
    
    return {
      order_id: orderDetails.order_id,
      order_amount: orderDetails.order_amount,
      order_currency: orderDetails.order_currency,
      order_status: orderDetails.order_status,
      payment_status: orderDetails.payment_status,
      payment_method: orderDetails.payment_method,
      payment_time: orderDetails.payment_time,
      payment_id: orderDetails.payment_id,
      payment_utr: orderDetails.payment_utr,
      customer_details: orderDetails.customer_details,
    };

  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error(`Failed to verify payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel an order using Cashfree SDK
 * @param orderId - Order ID to cancel
 * @returns Promise<boolean>
 */
export async function cancelOrder(orderId: string): Promise<boolean> {
  try {
    console.log('Cancelling order:', orderId);

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    const response = await cashfree.PGCancelOrder('2023-08-01', orderId);

    console.log('Order cancelled successfully:', orderId);
    return true;

  } catch (error) {
    console.error('Error cancelling order:', error);
    throw new Error(`Failed to cancel order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get payment methods available for an order
 * @param orderId - Order ID
 * @returns Promise<string[]>
 */
export async function getPaymentMethods(orderId: string): Promise<string[]> {
  try {
    console.log('Fetching payment methods for order:', orderId);

    const response = await cashfree.PGOrderFetchPayments('2023-08-01', orderId);
    
    // Return available payment methods
    return response.payment_methods || ['card', 'upi', 'netbanking', 'wallet'];

  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return ['card', 'upi', 'netbanking', 'wallet']; // Default fallback
  }
}

// Export the Cashfree instance for advanced usage
export { cashfree };
