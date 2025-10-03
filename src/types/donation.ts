/**
 * TypeScript interfaces for donation-related data structures
 */

export interface UserDonation {
  id: string;
  user_id: string | null;
  amount: number;
  donation_type: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_id?: string;
  cashfree_order_id?: string;
  payment_gateway?: string;
  receipt_number?: string;
  is_anonymous: boolean;
  dedication_message?: string;
  preacher_name?: string;
  created_at: string;
  updated_at: string;
  last_verified_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  mobile: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  country: string;
  pan_no?: string;
  created_at: string;
  updated_at: string;
}

export interface WebhookPayload {
  data: {
    order: {
      order_id: string;
      order_amount: number;
      order_currency: string;
      order_tags?: any;
    };
    payment: {
      cf_payment_id: string;
      payment_status: string;
      payment_amount: number;
      payment_currency: string;
      payment_message: string;
      payment_time: string;
      bank_reference?: string;
      auth_id?: string;
      payment_method?: any;
      payment_group?: string;
      international_payment?: any;
      payment_surcharge?: any;
    };
    customer_details: {
      customer_name: string;
      customer_id: string;
      customer_email: string;
      customer_phone: string;
    };
    payment_gateway_details: {
      gateway_name: string;
      gateway_order_id: string;
      gateway_payment_id: string;
      gateway_status_code?: string;
      gateway_order_reference_id?: string;
      gateway_settlement: string;
      gateway_reference_name?: string;
    };
    payment_offers?: any;
    terminal_details?: any;
  };
  event_time: string;
  type: string;
  event?: string; // Alternative field name
  order_id?: string; // Alternative field name
  payment_id?: string; // Alternative field name
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    code?: string;
    details?: string;
    hint?: string;
  } | null;
}

export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}
