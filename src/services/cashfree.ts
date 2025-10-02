/**
 * Cashfree Service - Frontend integration for payment processing
 */

export interface PaymentSessionData {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  order_meta: {
    return_url: string;
    notify_url?: string;
    payment_methods?: string;
  };
  order_note?: string;
}

export interface PaymentSessionResponse {
  success: boolean;
  data?: {
    order_id: string;
    payment_session_id: string;
    payment_url: string;
    order_amount: number;
    order_currency: string;
    customer_details: any;
  };
  message?: string;
  error?: string;
  details?: any;
}

/**
 * Generate a unique customer ID from mobile number
 * @param mobile Mobile number
 * @returns Customer ID
 */
export const generateCustomerId = (mobile: string): string => {
  // Cashfree requires customer_id to be alphanumeric with underscores or hyphens
  // Use mobile number as customer ID, removing all non-alphanumeric characters
  const cleaned = mobile.replace(/[^\d]/g, ''); // Remove all non-digit characters
  return `customer_${cleaned}`;
};

/**
 * Format phone number for Cashfree API
 * @param phone Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneForCashfree = (phone: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it starts with +91, keep it as is
  if (cleaned.startsWith('+91')) {
    return cleaned;
  }
  
  // If it starts with 91, add +
  if (cleaned.startsWith('91')) {
    return '+' + cleaned;
  }
  
  // If it's a 10-digit number, add +91
  if (cleaned.length === 10) {
    return '+91' + cleaned;
  }
  
  // If it's a 9-digit number, pad with 0 and add +91
  if (cleaned.length === 9) {
    return '+91' + '0' + cleaned;
  }
  
  // If it's longer than 10 digits, truncate to 10 and add +91
  if (cleaned.length > 10) {
    const last10Digits = cleaned.slice(-10);
    return '+91' + last10Digits;
  }
  
  // Return as is if it doesn't match expected patterns
  return cleaned;
};

/**
 * Create payment session by calling the backend API
 * @param sessionData Payment session data
 * @returns Promise with payment session response
 */
export const createPaymentSession = async (sessionData: PaymentSessionData): Promise<PaymentSessionResponse> => {
  try {
    console.log('Creating payment session with data:', sessionData);
    
    const response = await fetch('/api/payment/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        errorData = { error: 'Invalid response format' };
      }
      
      console.error('Payment session creation failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        response: response
      });
      
      console.error('Detailed error information:', errorData);
      
      return {
        success: false,
        error: errorData.error || 'Failed to create payment session',
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        details: errorData.details || { status: response.status, statusText: response.statusText }
      };
    }

    const data = await response.json();
    console.log('Payment session created successfully:', data);
    
    return data;
  } catch (error) {
    console.error('Error creating payment session:', error);
    return {
      success: false,
      error: 'Network Error',
      message: error instanceof Error ? error.message : 'Failed to create payment session'
    };
  }
};

/**
 * Verify payment status
 * @param orderId Order ID to verify
 * @returns Promise with verification response
 */
export const verifyPayment = async (orderId: string): Promise<any> => {
  try {
    console.log('Verifying payment for order:', orderId);
    
    const response = await fetch(`/api/payment/verify?orderId=${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Payment verification failed:', errorData);
      return {
        success: false,
        error: errorData.error || 'Failed to verify payment',
        message: errorData.message || 'Unknown error occurred'
      };
    }

    const data = await response.json();
    console.log('Payment verification successful:', data);
    
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      error: 'Network Error',
      message: error instanceof Error ? error.message : 'Failed to verify payment'
    };
  }
};

/**
 * Generate a unique order ID
 * @param prefix Order ID prefix
 * @returns Unique order ID
 */
export const generateOrderId = (prefix: string = 'donation'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Format amount for Cashfree API
 * @param amount Amount in rupees
 * @returns Formatted amount string
 */
export const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

/**
 * Validate email format
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param phone Phone number to validate
 * @returns Boolean indicating if phone is valid
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  const cleaned = phone.replace(/[^\d+]/g, '');
  return phoneRegex.test(cleaned);
};
