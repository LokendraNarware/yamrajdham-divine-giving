import { CASHFREE_CONFIG } from '@/config/cashfree';

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
  order_meta?: {
    return_url?: string;
    notify_url?: string;
  };
}

export interface PaymentResponse {
  payment_session_id: string;
  order_id: string;
  payment_url: string;
}

// Create payment session using backend simulation
export const createPaymentSession = async (sessionData: PaymentSessionData): Promise<PaymentResponse> => {
  try {
    console.log('Creating payment session via backend simulation:', {
      appId: CASHFREE_CONFIG.APP_ID,
      environment: CASHFREE_CONFIG.ENVIRONMENT
    });

    // Import the backend simulation
    const { createPaymentSessionBackend } = await import('./cashfree-backend');
    
    // Use backend simulation to create payment session
    const response = await createPaymentSessionBackend(sessionData);
    
    console.log('Payment session created successfully:', response);
    
    return response;
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw new Error(`Failed to create payment session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Verify payment status using backend simulation
export const verifyPayment = async (orderId: string): Promise<any> => {
  try {
    console.log('Verifying payment for order:', orderId);
    
    // Import the backend simulation
    const { verifyPaymentBackend } = await import('./cashfree-backend');
    
    // Use backend simulation to verify payment
    const response = await verifyPaymentBackend(orderId);
    
    console.log('Payment verification successful:', response);
    return response;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error(`Failed to verify payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get order details using backend simulation
export const getOrderDetails = async (orderId: string): Promise<any> => {
  try {
    console.log('Fetching order details for:', orderId);
    
    // Import the backend simulation
    const { getOrderDetailsBackend } = await import('./cashfree-backend');
    
    // Use backend simulation to get order details
    const response = await getOrderDetailsBackend(orderId);
    
    console.log('Order details fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw new Error(`Failed to fetch order details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Initialize Cashfree Web SDK for hosted checkout
export const initializeCashfreeWebSDK = () => {
  return new Promise((resolve, reject) => {
    // Check if Cashfree is already loaded
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => {
      if (window.Cashfree) {
        console.log('Cashfree SDK loaded successfully');
        resolve(window.Cashfree);
      } else {
        reject(new Error('Cashfree SDK not loaded'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Cashfree SDK'));
    };
    document.head.appendChild(script);
  });
};

// Declare global Cashfree type
declare global {
  interface Window {
    Cashfree: any;
  }
}