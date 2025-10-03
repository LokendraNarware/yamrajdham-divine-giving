/**
 * Unit tests for the Cashfree webhook handler
 * Tests webhook processing, error handling, and edge cases
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { POST, GET, OPTIONS, HEAD } from '@/app/api/webhook/cashfree/route';
import { 
  mockWebhookPayload, 
  mockUserDonation, 
  createMockRequest, 
  createMockSupabaseResponse,
  TEST_CONSTANTS,
  setupTestEnvironment,
  cleanupTestEnvironment,
} from '@/lib/test-utils';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
  },
}));

jest.mock('@/lib/structured-logger', () => ({
  logger: {
    webhookReceived: jest.fn(),
    webhookProcessed: jest.fn(),
    webhookError: jest.fn(),
    donationUpdated: jest.fn(),
    databaseError: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Cashfree Webhook Handler', () => {
  beforeEach(() => {
    setupTestEnvironment();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe('POST /api/webhook/cashfree', () => {
    it('should handle test webhook requests', async () => {
      const mockRequest = createMockRequest({}, {
        'x-webhook-signature': '',
        'user-agent': 'test-agent',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.test).toBe(true);
    });

    it('should process PAYMENT_SUCCESS_WEBHOOK correctly', async () => {
      const payload = mockWebhookPayload({ type: 'PAYMENT_SUCCESS_WEBHOOK' });
      const mockRequest = createMockRequest(payload, {
        'x-webhook-signature': TEST_CONSTANTS.VALID_SIGNATURE,
        'x-webhook-version': '2025-01-01',
      });

      // Mock successful donation lookup
      const { supabase } = await import('@/integrations/supabase/client');
      supabase.from().select().eq().single.mockResolvedValueOnce(
        createMockSupabaseResponse(mockUserDonation())
      );
      supabase.from().update().eq.mockResolvedValueOnce(
        createMockSupabaseResponse(null)
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.new_status).toBe('completed');
    });

    it('should handle missing donation gracefully', async () => {
      const payload = mockWebhookPayload({ type: 'PAYMENT_SUCCESS_WEBHOOK' });
      const mockRequest = createMockRequest(payload, {
        'x-webhook-signature': TEST_CONSTANTS.VALID_SIGNATURE,
        'x-webhook-version': '2025-01-01',
      });

      // Mock donation not found
      const { supabase } = await import('@/integrations/supabase/client');
      supabase.from().select().eq().single.mockResolvedValueOnce(
        createMockSupabaseResponse(null, { code: 'PGRST116' })
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.not_found).toBe(true);
    });

    it('should reject invalid signatures', async () => {
      const payload = mockWebhookPayload();
      const mockRequest = createMockRequest(payload, {
        'x-webhook-signature': TEST_CONSTANTS.INVALID_SIGNATURE,
        'x-webhook-version': '2025-01-01',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid signature');
    });

    it('should handle invalid JSON payload', async () => {
      const mockRequest = createMockRequest('invalid json', {
        'x-webhook-signature': TEST_CONSTANTS.VALID_SIGNATURE,
        'x-webhook-version': '2025-01-01',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid JSON payload');
    });

    it('should ignore unrelated events', async () => {
      const payload = mockWebhookPayload({ type: 'UNRELATED_EVENT' });
      const mockRequest = createMockRequest(payload, {
        'x-webhook-signature': TEST_CONSTANTS.VALID_SIGNATURE,
        'x-webhook-version': '2025-01-01',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.ignored).toBe(true);
    });
  });

  describe('GET /api/webhook/cashfree', () => {
    it('should return webhook status', async () => {
      const mockRequest = createMockRequest({}, {});
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.message).toContain('webhook endpoint is active');
    });

    it('should return detailed status for test parameter', async () => {
      const mockRequest = createMockRequest({}, {});
      const url = new URL('https://example.com/api/webhook/cashfree?test=webhook');
      mockRequest.url = url.toString();

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.test).toBe(true);
      expect(data.hasSecret).toBeDefined();
    });
  });

  describe('OPTIONS /api/webhook/cashfree', () => {
    it('should handle CORS preflight requests', async () => {
      const mockRequest = createMockRequest({}, {});
      const response = await OPTIONS(mockRequest);

      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });

  describe('HEAD /api/webhook/cashfree', () => {
    it('should return webhook status headers', async () => {
      const mockRequest = createMockRequest({}, {});
      const response = await HEAD(mockRequest);

      expect(response.status).toBe(200);
      expect(response.headers.get('X-Webhook-Status')).toBe('active');
      expect(response.headers.get('X-Webhook-Version')).toBe('2025-01-01');
    });
  });

  describe('Event Type Mapping', () => {
    const testCases = [
      { eventType: 'PAYMENT_SUCCESS_WEBHOOK', expectedStatus: 'completed' },
      { eventType: 'PAYMENT_FAILED_WEBHOOK', expectedStatus: 'failed' },
      { eventType: 'PAYMENT_USER_DROPPED_WEBHOOK', expectedStatus: 'failed' },
      { eventType: 'PAYMENT_REFUND_SUCCESS', expectedStatus: 'refunded' },
      { eventType: 'REFUND_SUCCESS', expectedStatus: 'refunded' },
      { eventType: 'UNKNOWN_EVENT', expectedStatus: null },
    ];

    testCases.forEach(({ eventType, expectedStatus }) => {
      it(`should map ${eventType} to ${expectedStatus}`, async () => {
        const payload = mockWebhookPayload({ type: eventType });
        const mockRequest = createMockRequest(payload, {
          'x-webhook-signature': TEST_CONSTANTS.VALID_SIGNATURE,
          'x-webhook-version': '2025-01-01',
        });

        if (expectedStatus) {
          // Mock successful donation lookup and update
          const { supabase } = await import('@/integrations/supabase/client');
          supabase.from().select().eq().single.mockResolvedValueOnce(
            createMockSupabaseResponse(mockUserDonation())
          );
          supabase.from().update().eq.mockResolvedValueOnce(
            createMockSupabaseResponse(null)
          );
        }

        const response = await POST(mockRequest);
        const data = await response.json();

        if (expectedStatus) {
          expect(data.success).toBe(true);
          expect(data.new_status).toBe(expectedStatus);
        } else {
          expect(data.success).toBe(true);
          expect(data.ignored).toBe(true);
        }
      });
    });
  });
});
