import { z } from 'zod';
import { CASHFREE_CONFIG } from '@/config/cashfree';

// Validation schemas for type safety
const CustomerDetailsSchema = z.object({
  customer_id: z.string().min(1, 'Customer ID is required'),
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z.string().email('Valid email is required'),
  customer_phone: z.string().min(10, 'Valid phone number is required'),
});

const OrderMetaSchema = z.object({
  return_url: z.string().url().optional(),
  notify_url: z.string().url().optional(),
  payment_methods: z.string().optional(),
}).optional();

export const PaymentSessionDataSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
  order_amount: z.number().positive('Order amount must be positive'),
  order_currency: z.string().default('INR'),
  customer_details: CustomerDetailsSchema,
  order_meta: OrderMetaSchema,
});

export const PaymentResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    payment_session_id: z.string(),
    order_id: z.string(),
    payment_url: z.string().optional(),
    cf_order_id: z.string().optional(),
  }),
});

export const OrderDetailsSchema = z.object({
  order_id: z.string(),
  order_amount: z.number(),
  order_currency: z.string(),
  order_status: z.string(),
  payment_status: z.string().optional(),
  payment_method: z.string().optional(),
  payment_time: z.string().optional(),
  payment_id: z.string().optional(),
  payment_utr: z.string().optional(),
  customer_details: CustomerDetailsSchema,
});

// Type definitions
export type PaymentSessionData = z.infer<typeof PaymentSessionDataSchema>;
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;
export type OrderDetails = z.infer<typeof OrderDetailsSchema>;
export type CustomerDetails = z.infer<typeof CustomerDetailsSchema>;

/**
 * Create payment session using Cashfree Create Order API
 * @param sessionData - Payment session data
 * @returns Promise<PaymentResponse>
 */
export const createPaymentSession = async (sessionData: PaymentSessionData): Promise<PaymentResponse> => {
  try {
    // Validate input data
    const validatedData = PaymentSessionDataSchema.parse(sessionData);
    
    console.log('Creating payment session via Cashfree API:', {
      orderId: validatedData.order_id,
      amount: validatedData.order_amount,
      currency: validatedData.order_currency
    });

    const response = await fetch('/api/payment/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      
      // Handle specific error cases
      if (response.status === 409) {
        throw new Error('Order ID already exists. Please use a different order ID.');
      } else if (response.status === 400) {
        throw new Error(errorData.details ? 
          `Validation failed: ${errorData.details.map((d: any) => d.message).join(', ')}` : 
          errorData.error || 'Invalid request data');
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please check your credentials.');
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to create payment session`);
    }

    const data = await response.json();
    
    // Validate response data
    const validatedResponse = PaymentResponseSchema.parse(data);
    
    console.log('Payment session created successfully:', {
      orderId: validatedResponse.data.order_id,
      sessionId: validatedResponse.data.payment_session_id
    });
    
    return validatedResponse;
  } catch (error) {
    console.error('Error creating payment session:', error);
    
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues?.map((e: any) => e.message).join(', ') || 'Unknown validation error';
      throw new Error(`Validation error: ${errorMessages}`);
    }
    
    throw new Error(`Failed to create payment session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


/**
 * Verify payment status using Cashfree API
 * @param orderId - Order ID to verify
 * @returns Promise<OrderDetails>
 */
export const verifyPayment = async (orderId: string): Promise<OrderDetails> => {
  try {
    if (!orderId || orderId.trim() === '') {
      throw new Error('Order ID is required');
    }
    
    console.log('Verifying payment for order:', orderId);
    
    const response = await fetch(`/api/payment/verify?orderId=${encodeURIComponent(orderId)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      
      if (response.status === 404) {
        throw new Error('Order not found. Please check the order ID.');
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please check your credentials.');
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to verify payment`);
    }

    const data = await response.json();
    
    // Validate response data
    const validatedData = OrderDetailsSchema.parse(data);
    
    console.log('Payment verification successful:', {
      orderId: validatedData.order_id,
      status: validatedData.order_status,
      paymentStatus: validatedData.payment_status
    });
    
    return validatedData;
  } catch (error) {
    console.error('Error verifying payment:', error);
    
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues?.map((e: any) => e.message).join(', ') || 'Unknown validation error';
      throw new Error(`Response validation error: ${errorMessages}`);
    }
    
    throw new Error(`Failed to verify payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Utility function to generate unique order ID
 * @param prefix - Optional prefix for order ID
 * @returns string - Unique order ID
 */
export const generateOrderId = (prefix: string = 'order'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Utility function to generate valid customer ID from email
 * @param email - Customer email address
 * @returns string - Valid customer ID for Cashfree
 */
export const generateCustomerId = (email: string): string => {
  // Remove special characters and replace with underscores
  const cleanEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = Date.now();
  return `customer_${cleanEmail}_${timestamp}`;
};

/**
 * Utility function to format amount for display
 * @param amount - Amount in paise
 * @returns string - Formatted amount
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
