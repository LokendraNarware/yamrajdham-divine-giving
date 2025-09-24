import CryptoJS from 'crypto-js';

/**
 * Verify Cashfree webhook signature
 * @param payload - Raw webhook payload
 * @param signature - Webhook signature from headers
 * @param secret - Webhook secret key
 * @returns boolean - Whether signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    if (!payload || !signature || !secret) {
      console.error('Missing required parameters for webhook verification');
      return false;
    }

    // Create HMAC SHA256 hash
    const expectedSignature = CryptoJS.HmacSHA256(payload, secret).toString(CryptoJS.enc.Hex);
    
    // Compare signatures (case-insensitive)
    const isValid = signature.toLowerCase() === expectedSignature.toLowerCase();
    
    if (!isValid) {
      console.error('Webhook signature verification failed', {
        expected: expectedSignature,
        received: signature
      });
    }
    
    return isValid;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Parse webhook payload safely
 * @param payload - Raw webhook payload
 * @returns Parsed webhook data or null if invalid
 */
export function parseWebhookPayload(payload: string): any {
  try {
    return JSON.parse(payload);
  } catch (error) {
    console.error('Error parsing webhook payload:', error);
    return null;
  }
}

/**
 * Validate webhook data structure
 * @param data - Parsed webhook data
 * @returns boolean - Whether data structure is valid
 */
export function validateWebhookData(data: any): boolean {
  try {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Check required fields
    if (!data.type || !data.data) {
      return false;
    }

    // Check order data
    if (!data.data.order || !data.data.order.order_id) {
      return false;
    }

    // Check customer data
    if (!data.data.customer_details) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating webhook data:', error);
    return false;
  }
}

/**
 * Extract webhook signature from headers
 * @param headers - Request headers
 * @returns string | null - Signature or null if not found
 */
export function extractWebhookSignature(headers: Headers): string | null {
  // Try different header names that Cashfree might use
  const possibleHeaders = [
    'x-webhook-signature',
    'x-cashfree-signature',
    'x-signature',
    'signature'
  ];

  for (const headerName of possibleHeaders) {
    const signature = headers.get(headerName);
    if (signature) {
      return signature;
    }
  }

  return null;
}

/**
 * Log webhook event for debugging
 * @param eventType - Type of webhook event
 * @param orderId - Order ID
 * @param status - Payment status
 */
export function logWebhookEvent(eventType: string, orderId: string, status: string): void {
  console.log('Webhook event received:', {
    eventType,
    orderId,
    status,
    timestamp: new Date().toISOString()
  });
}
