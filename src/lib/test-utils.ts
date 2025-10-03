/**
 * Test utilities for the donation platform
 * Provides testing helpers and mock data for unit and integration tests
 */

import { UserDonation, WebhookPayload } from '@/types/donation';

// Mock data generators
export const mockUserDonation = (overrides: Partial<UserDonation> = {}): UserDonation => ({
  id: 'test-donation-id',
  user_id: 'test-user-id',
  amount: 1000,
  donation_type: 'general',
  payment_status: 'pending',
  payment_id: 'test-payment-id',
  cashfree_order_id: 'test-cashfree-order-id',
  payment_gateway: 'cashfree',
  receipt_number: 'RCP-001',
  is_anonymous: false,
  dedication_message: 'Test donation message',
  preacher_name: 'Test Preacher',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_verified_at: new Date().toISOString(),
  ...overrides,
});

export const mockWebhookPayload = (overrides: Partial<WebhookPayload> = {}): WebhookPayload => ({
  data: {
    order: {
      order_id: 'test-order-id',
      order_amount: 1000,
      order_currency: 'INR',
      order_tags: undefined,
    },
    payment: {
      cf_payment_id: 'test-payment-id',
      payment_status: 'SUCCESS',
      payment_amount: 1000,
      payment_currency: 'INR',
      payment_message: 'Payment successful',
      payment_time: new Date().toISOString(),
      bank_reference: '1234567890',
      auth_id: undefined,
      payment_method: {
        upi: {
          channel: undefined,
          upi_id: 'test@upi',
          upi_payer_ifsc: undefined,
          upi_payer_account_number: undefined,
          upi_instrument: 'UPI',
          upi_instrument_number: undefined,
        },
      },
      payment_group: 'upi',
      international_payment: undefined,
      payment_surcharge: {
        payment_surcharge_service_charge: 0,
        payment_surcharge_service_tax: 0,
      },
    },
    customer_details: {
      customer_name: 'Test Customer',
      customer_id: 'customer_123',
      customer_email: 'test@example.com',
      customer_phone: '+919876543210',
    },
    payment_gateway_details: {
      gateway_name: 'CASHFREE',
      gateway_order_id: 'test-gateway-order-id',
      gateway_payment_id: 'test-gateway-payment-id',
      gateway_status_code: undefined,
      gateway_order_reference_id: undefined,
      gateway_settlement: 'CASHFREE',
      gateway_reference_name: undefined,
    },
    payment_offers: undefined,
    terminal_details: undefined,
  },
  event_time: new Date().toISOString(),
  type: 'PAYMENT_SUCCESS_WEBHOOK',
  ...overrides,
});

// Test helpers
export const createMockRequest = (body: any, headers: Record<string, string> = {}) => {
  return {
    text: async () => JSON.stringify(body),
    headers: {
      get: (name: string) => headers[name] || null,
      entries: () => Object.entries(headers),
    },
    url: 'https://example.com/api/webhook/cashfree',
    method: 'POST',
  } as any;
};

export const createMockSupabaseResponse = <T>(data: T | null, error: any = null) => ({
  data,
  error,
});

// Test constants
export const TEST_CONSTANTS = {
  VALID_SIGNATURE: 'valid-signature-hash',
  INVALID_SIGNATURE: 'invalid-signature-hash',
  TEST_WEBHOOK_SECRET: 'test-webhook-secret',
  TEST_ORDER_ID: 'test-order-id-123',
  TEST_PAYMENT_ID: 'test-payment-id-456',
  TEST_DONATION_ID: 'test-donation-id-789',
} as const;

// Test assertions
export const expectWebhookResponse = (response: any, expectedStatus: number, expectedSuccess: boolean) => {
  // This function will be used in tests with proper Jest imports
  return {
    status: response.status === expectedStatus,
    success: response.success === expectedSuccess,
  };
};

export const expectDonationUpdate = (donation: UserDonation, expectedStatus: string) => {
  // This function will be used in tests with proper Jest imports
  return {
    statusMatch: donation.payment_status === expectedStatus,
    hasTimestamp: !!donation.last_verified_at,
  };
};

// Mock functions for testing
export const mockSupabaseClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve(createMockSupabaseResponse(mockUserDonation())),
      }),
    }),
    update: () => ({
      eq: () => Promise.resolve(createMockSupabaseResponse(null)),
    }),
  }),
};

// Test data sets
export const TEST_DONATIONS = [
  mockUserDonation({ id: 'donation-1', amount: 500, payment_status: 'pending' }),
  mockUserDonation({ id: 'donation-2', amount: 1000, payment_status: 'completed' }),
  mockUserDonation({ id: 'donation-3', amount: 2000, payment_status: 'failed' }),
];

export const TEST_WEBHOOK_PAYLOADS = [
  mockWebhookPayload({ type: 'PAYMENT_SUCCESS_WEBHOOK' }),
  mockWebhookPayload({ type: 'PAYMENT_FAILED_WEBHOOK' }),
  mockWebhookPayload({ type: 'PAYMENT_USER_DROPPED_WEBHOOK' }),
  mockWebhookPayload({ type: 'PAYMENT_REFUND_SUCCESS' }),
  mockWebhookPayload({ type: 'REFUND_SUCCESS' }),
];

// Test environment setup
export const setupTestEnvironment = () => {
  // Note: In actual tests, these would be set via test configuration
  // This is just a placeholder for the build process
  return {
    NODE_ENV: 'test',
    CASHFREE_WEBHOOK_SECRET: TEST_CONSTANTS.TEST_WEBHOOK_SECRET,
    CASHFREE_WEBHOOK_ALLOW_INSECURE: 'true',
  };
};

export const cleanupTestEnvironment = () => {
  // Note: In actual tests, this would clean up environment variables
  // This is just a placeholder for the build process
  return true;
};
