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

// Create payment session using Cashfree API
export const createPaymentSession = async (sessionData: PaymentSessionData): Promise<PaymentResponse> => {
  try {
    // Demo mode - simulate payment session creation
    if (CASHFREE_CONFIG.DEMO_MODE) {
      console.log('Demo Mode: Simulating payment session creation');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            payment_session_id: `demo_session_${Date.now()}`,
            order_id: sessionData.order_id,
            payment_url: `${window.location.origin}/donate/success?order_id=${sessionData.order_id}&demo=true`,
          });
        }, 1000);
      });
    }

    const response = await fetch(`${CASHFREE_CONFIG.BASE_URL}/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_CONFIG.APP_ID,
        'x-client-secret': CASHFREE_CONFIG.SECRET_KEY,
      },
      body: JSON.stringify({
        order_id: sessionData.order_id,
        order_amount: sessionData.order_amount,
        order_currency: sessionData.order_currency,
        customer_details: sessionData.customer_details,
        order_meta: sessionData.order_meta,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment session');
    }

    const data = await response.json();
    return {
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
      payment_url: data.payment_url,
    };
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw new Error('Failed to create payment session');
  }
};

// Verify payment status
export const verifyPayment = async (orderId: string): Promise<any> => {
  try {
    const response = await fetch(`${CASHFREE_CONFIG.BASE_URL}/pg/orders/${orderId}/payments`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_CONFIG.APP_ID,
        'x-client-secret': CASHFREE_CONFIG.SECRET_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Failed to verify payment');
  }
};

// Get order details
export const getOrderDetails = async (orderId: string): Promise<any> => {
  try {
    // Demo mode - simulate order details
    if (CASHFREE_CONFIG.DEMO_MODE) {
      console.log('Demo Mode: Simulating order details fetch');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            order_id: orderId,
            order_amount: 1001, // Default demo amount
            order_currency: 'INR',
            payment_status: 'SUCCESS',
            payment_method: 'UPI',
            payment_time: new Date().toISOString(),
            customer_details: {
              customer_name: 'Demo User',
              customer_email: 'demo@example.com',
              customer_phone: '9999999999',
            },
          });
        }, 1000);
      });
    }

    const response = await fetch(`${CASHFREE_CONFIG.BASE_URL}/pg/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_CONFIG.APP_ID,
        'x-client-secret': CASHFREE_CONFIG.SECRET_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch order details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw new Error('Failed to fetch order details');
  }
};

// Initialize Cashfree Web SDK for hosted checkout
export const initializeCashfreeWebSDK = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => {
      if (window.Cashfree) {
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
