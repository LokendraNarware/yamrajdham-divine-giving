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

// Create payment session using Next.js API route
export const createPaymentSession = async (sessionData: PaymentSessionData): Promise<PaymentResponse> => {
  try {
    console.log('Creating payment session via Next.js API:', sessionData);

    const response = await fetch('/api/payment/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to create payment session`);
    }

    const data = await response.json();
    console.log('Payment session created successfully:', data);
    
    return {
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
      payment_url: data.payment_url,
    };
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw new Error(`Failed to create payment session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Verify payment status using Next.js API route
export const verifyPayment = async (orderId: string): Promise<any> => {
  try {
    console.log('Verifying payment for order:', orderId);
    
    const response = await fetch(`/api/payment/verify?orderId=${orderId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to verify payment`);
    }

    const data = await response.json();
    console.log('Payment verification successful:', data);
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error(`Failed to verify payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get order details using Next.js API route
export const getOrderDetails = async (orderId: string): Promise<any> => {
  try {
    console.log('Fetching order details for:', orderId);
    
    const response = await fetch(`/api/payment/verify?orderId=${orderId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch order details`);
    }

    const data = await response.json();
    console.log('Order details fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw new Error(`Failed to fetch order details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};