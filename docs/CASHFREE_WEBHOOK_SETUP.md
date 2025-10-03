# Cashfree Webhook Setup Guide

## Overview

This guide explains how to configure Cashfree webhooks for the Yamraj Dham Divine Giving platform. The webhook endpoint handles payment status updates from Cashfree and automatically updates donation records in the database.

## Webhook Endpoint Details

### Endpoint URL
```
https://yamrajdham.com/api/webhook/cashfree
```

### Supported HTTP Methods
- **POST**: Main webhook handler for payment events
- **GET**: Health check and testing endpoint
- **HEAD**: Lightweight health check
- **OPTIONS**: CORS preflight requests

### Webhook Version
- **Version**: 2025-01-01
- **Signature Algorithm**: HMAC-SHA256 with Base64 encoding
- **Content Type**: application/json

## Cashfree Dashboard Configuration

### 1. Access Webhook Settings
1. Log in to your Cashfree merchant dashboard
2. Navigate to **Settings** → **Webhooks**
3. Click **Add Webhook**

### 2. Configure Webhook Details
```
Webhook URL: https://yamrajdham.com/api/webhook/cashfree
Webhook Version: 2025-01-01
Events to Subscribe:
  ✅ PAYMENT_SUCCESS_WEBHOOK
  ✅ PAYMENT_FAILED_WEBHOOK
  ✅ PAYMENT_USER_DROPPED_WEBHOOK
  ✅ PAYMENT_REFUND_SUCCESS
  ✅ REFUND_SUCCESS
```

### 3. Webhook Secret
- Generate a strong webhook secret (32+ characters)
- Store it securely in your environment variables
- Use the same secret for signature verification

## Environment Variables

### Required Variables
```bash
# Cashfree Webhook Configuration
CASHFREE_WEBHOOK_SECRET=your_webhook_secret_here
CASHFREE_APP_ID=your_app_id_here
CASHFREE_SECRET_KEY=your_secret_key_here
CASHFREE_ENVIRONMENT=production  # or 'sandbox' for testing
```

### Optional Variables
```bash
# Allow insecure webhooks (for testing only)
CASHFREE_WEBHOOK_ALLOW_INSECURE=false
```

## Testing the Webhook

### 1. Health Check
Test if the endpoint is accessible:
```bash
curl -X GET "https://yamrajdham.com/api/webhook/cashfree?test=webhook"
```

Expected response:
```json
{
  "status": "ok",
  "message": "Cashfree webhook endpoint is active and ready",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "methods": ["POST", "GET", "HEAD", "OPTIONS"],
  "version": "2025-01-01",
  "environment": "production",
  "hasSecret": true,
  "allowInsecure": false,
  "endpoint": "https://yamrajdham.com/api/webhook/cashfree",
  "test": true
}
```

### 2. Cashfree Test Webhook
1. In Cashfree dashboard, go to **Settings** → **Webhooks**
2. Click **Test Webhook** next to your configured webhook
3. Select **Webhook Version**: 2025-01-01
4. Click **Send Test**

### 3. Manual Test (for debugging)
```bash
curl -X POST "https://yamrajdham.com/api/webhook/cashfree" \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: your_signature_here" \
  -H "x-webhook-version: 2025-01-01" \
  -d '{"type":"test","data":{"test":true}}'
```

## Webhook Event Processing

### Supported Events
| Event Type | Database Status | Description |
|------------|----------------|-------------|
| `PAYMENT_SUCCESS_WEBHOOK` | `completed` | Payment successful |
| `PAYMENT_FAILED_WEBHOOK` | `failed` | Payment failed |
| `PAYMENT_USER_DROPPED_WEBHOOK` | `failed` | User abandoned payment |
| `PAYMENT_REFUND_SUCCESS` | `refunded` | Refund processed |
| `REFUND_SUCCESS` | `refunded` | Refund completed |

### Event Processing Flow
1. **Receive Webhook**: Cashfree sends POST request to endpoint
2. **Verify Signature**: Validate HMAC-SHA256 signature
3. **Parse Payload**: Extract event type and order ID
4. **Lookup Donation**: Find donation by `cashfree_order_id`
5. **Update Status**: Update donation status in database
6. **Send Response**: Return success/failure response

### Database Lookup Strategy
The webhook uses a 3-tier lookup system:
1. **Primary**: `cashfree_order_id` field
2. **Fallback 1**: `payment_id` field
3. **Fallback 2**: `id` field (for backward compatibility)

## Troubleshooting

### Common Issues

#### 1. "Endpoint did not respond properly to the test"
**Causes:**
- Webhook endpoint not accessible
- Incorrect URL configuration
- Server errors or timeouts

**Solutions:**
- Verify endpoint URL is correct
- Check server logs for errors
- Test with manual curl request
- Ensure proper CORS headers

#### 2. "Invalid signature" Error
**Causes:**
- Webhook secret mismatch
- Incorrect signature algorithm
- Body encoding issues

**Solutions:**
- Verify `CASHFREE_WEBHOOK_SECRET` matches dashboard
- Check webhook version is 2025-01-01
- Ensure raw body is used for signature verification

#### 3. "Donation not found" Error
**Causes:**
- Order ID mismatch
- Database connection issues
- Missing `cashfree_order_id` field

**Solutions:**
- Check database migration applied
- Verify order ID mapping
- Review webhook logs for lookup details

### Debugging Steps

#### 1. Check Webhook Logs
```bash
# View server logs for webhook requests
# Look for detailed logging output including:
# - Request headers
# - Signature verification details
# - Database lookup results
# - Error messages
```

#### 2. Test Endpoint Accessibility
```bash
# Test basic connectivity
curl -I "https://yamrajdham.com/api/webhook/cashfree"

# Test with different methods
curl -X GET "https://yamrajdham.com/api/webhook/cashfree?test=webhook"
curl -X HEAD "https://yamrajdham.com/api/webhook/cashfree"
curl -X OPTIONS "https://yamrajdham.com/api/webhook/cashfree"
```

#### 3. Verify Environment Variables
```bash
# Check if webhook secret is configured
curl -X GET "https://yamrajdham.com/api/webhook/cashfree?test=webhook" | jq '.hasSecret'
```

## Security Considerations

### 1. Signature Verification
- Always verify webhook signatures
- Use strong, unique webhook secrets
- Never disable signature verification in production

### 2. HTTPS Only
- Webhook endpoint must use HTTPS
- Cashfree requires secure connections
- No HTTP webhooks allowed

### 3. Rate Limiting
- Implement rate limiting if needed
- Monitor for unusual webhook patterns
- Log all webhook attempts

## Monitoring and Alerts

### 1. Webhook Health Monitoring
- Monitor endpoint response times
- Track webhook success/failure rates
- Set up alerts for webhook failures

### 2. Database Monitoring
- Monitor donation status updates
- Track webhook processing times
- Alert on database errors

### 3. Log Analysis
- Review webhook logs regularly
- Monitor for signature verification failures
- Track donation lookup success rates

## Production Checklist

Before going live, ensure:

- [ ] Webhook URL is accessible and returns 200 OK
- [ ] Cashfree test webhook passes successfully
- [ ] Environment variables are properly configured
- [ ] Database migration for `cashfree_order_id` is applied
- [ ] Signature verification is working
- [ ] Error logging is comprehensive
- [ ] Monitoring and alerts are set up
- [ ] Backup webhook processing is considered

## Support

For issues with webhook configuration:
1. Check this documentation first
2. Review server logs for detailed error information
3. Test with manual curl requests
4. Contact development team with specific error messages

## Changelog

### Version 2025-01-01
- Enhanced test request detection
- Improved signature verification logging
- Added comprehensive error handling
- Better CORS support for webhook testing
- Enhanced webhook response headers
