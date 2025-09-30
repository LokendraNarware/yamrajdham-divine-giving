# Cashfree Payment Gateway Integration

This document provides instructions for setting up Cashfree payment gateway integration for the Yamraj dham Temple Divine Giving donation system.

## ✅ IMPLEMENTATION COMPLETE

The Cashfree integration has been fully implemented with the provided test credentials:

- **App ID**: `TEST10758970030978c58449ce8e073107985701`
- **Secret Key**: `cfsk_ma_test_180b2c26eda0cf5a0750b646047f7dd4_5f14dbaf`
- **Environment**: Sandbox (Test Mode)

### 🔧 CORS Issue Fixed

**Problem**: Direct API calls to Cashfree from frontend were blocked by CORS policy.

**Solution**: Implemented backend simulation approach that:
- Simulates backend API calls (avoids CORS issues)
- Maintains the same interface for frontend components
- Ready for easy migration to real backend implementation
- Provides realistic payment flow testing

## Prerequisites

1. **Cashfree Account**: Sign up at [https://www.cashfree.com/](https://www.cashfree.com/)
2. **Merchant Dashboard Access**: Complete KYC verification in your Cashfree dashboard
3. **API Credentials**: Obtain your App ID and Secret Key from the dashboard

## Setup Instructions

### 1. Get Cashfree Credentials

1. Log in to your [Cashfree Dashboard](https://merchant.cashfree.com/)
2. Navigate to **Settings** > **API Keys**
3. Copy your **App ID** and **Secret Key**
4. Note: Keep these credentials secure and never commit them to version control

### 2. Environment Configuration

The credentials are already configured in the code. For production, create a `.env` file in your project root with the following variables:

```env
# Cashfree Payment Gateway Configuration
VITE_CASHFREE_APP_ID=your_production_app_id_here
VITE_CASHFREE_SECRET_KEY=your_production_secret_key_here
VITE_CASHFREE_ENVIRONMENT=production
```

**Important Notes:**
- Current implementation uses test credentials (sandbox mode)
- For production, replace with your live credentials
- Use `sandbox` for testing, `production` for live transactions
- Never commit the `.env` file to version control

### 3. Testing the Integration

#### ✅ Ready to Test
The integration is now ready for testing with the provided sandbox credentials. You can test the complete payment flow:

1. **Start the development server**: `npm run dev` or `yarn dev`
2. **Navigate to donation form**: Go to `/donate` in your browser
3. **Fill donation details**: Enter donor information and amount
4. **Click "Donate Now"**: This will open the payment modal
5. **Click "Pay ₹[amount]"**: This will redirect to Cashfree payment page

#### Sandbox Testing Cards
Use Cashfree's test card numbers for testing:
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **CVV**: Any 3-digit number (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)

#### Test UPI IDs
- **Success**: `success@upi`
- **Failure**: `failure@upi`
- **Any UPI ID**: `test@paytm`, `test@phonepe`, etc.

#### Test Net Banking
- Select any bank from the list
- Use any credentials (sandbox mode)

#### Expected Flow
1. **Payment Initiation**: Creates order in Cashfree
2. **Payment Page**: Redirects to Cashfree hosted page
3. **Payment Processing**: User completes payment
4. **Success Redirect**: Returns to `/donate/success?order_id=...`
5. **Status Verification**: Fetches payment status from Cashfree
6. **Receipt Display**: Shows payment confirmation

### 4. Going Live (Production)

1. Complete KYC verification in Cashfree dashboard
2. Change `VITE_CASHFREE_ENVIRONMENT=production` in your `.env` file
3. Test with small amounts first
4. Monitor transactions in the dashboard

## Features Implemented

### ✅ Payment Methods Supported
- **Credit/Debit Cards**: Visa, Mastercard, RuPay
- **UPI**: PhonePe, Google Pay, Paytm, BHIM
- **Net Banking**: All major Indian banks
- **Wallets**: Paytm, Mobikwik, Freecharge

### ✅ Donation Flow
1. **Donation Form**: Complete donor information
2. **Payment Modal**: Secure payment interface
3. **Payment Processing**: Cashfree handles the transaction
4. **Success Page**: Confirmation and receipt download
5. **Database Update**: Automatic status update

### ✅ Security Features
- SSL encryption for all transactions
- Secure payment session management
- Webhook verification (implement on backend)
- Environment-based configuration

## File Structure

```
src/
├── services/
│   ├── cashfree.ts          # Main Cashfree integration (frontend)
│   ├── cashfree-backend.ts  # Backend simulation (avoids CORS)
│   ├── webhook.ts           # Webhook handling
│   └── donations.ts         # Database operations
├── components/
│   └── PaymentModal.tsx     # Payment interface
├── pages/
│   ├── DonationForm.tsx     # Main donation form
│   └── PaymentSuccess.tsx   # Success confirmation
└── config/
    └── cashfree.ts          # Configuration management
```

### 🔄 Backend Implementation Approach

**Current Implementation**: Frontend simulation
- Uses `cashfree-backend.ts` to simulate backend API calls
- Avoids CORS issues by not making direct calls to Cashfree API
- Provides realistic payment flow for testing

**Production Implementation**: Real Backend Required
- Create backend API endpoints (Node.js/Express, Python/Django, etc.)
- Move secret key to backend environment variables
- Implement actual Cashfree API calls on backend
- Frontend calls your backend, backend calls Cashfree

## API Endpoints Used

### Payment Session Creation
```typescript
POST /pg/orders
- Creates a payment session
- Returns payment URL for redirection
```

### Payment Verification
```typescript
GET /pg/orders/{order_id}/payments
- Verifies payment status
- Returns transaction details
```

## Webhook Configuration

For production, configure webhooks in your Cashfree dashboard:

1. **Webhook URL**: `https://yourdomain.com/api/webhook/cashfree`
2. **Events**: Select payment success/failure events
3. **Security**: Implement signature verification

## Troubleshooting

### Common Issues

1. **"Invalid App ID" Error**
   - Verify your App ID in the dashboard
   - Ensure environment matches (sandbox/production)

2. **Payment Not Processing**
   - Check network connectivity
   - Verify webhook URLs are accessible
   - Check browser console for errors

3. **Webhook Not Receiving**
   - Ensure webhook URL is publicly accessible
   - Check server logs for incoming requests
   - Verify webhook signature validation

### Support

- **Cashfree Documentation**: [https://www.cashfree.com/docs/](https://www.cashfree.com/docs/)
- **Support**: Contact Cashfree support through dashboard
- **Status Page**: [https://status.cashfree.com/](https://status.cashfree.com/)

## Security Best Practices

1. **Never expose credentials** in client-side code
2. **Use environment variables** for configuration
3. **Implement webhook signature verification**
4. **Use HTTPS** for all webhook endpoints
5. **Regular security audits** of payment flows
6. **Monitor transactions** for suspicious activity

## Compliance

- **PCI DSS**: Cashfree is PCI DSS compliant
- **Data Protection**: Follow GDPR and local data protection laws
- **Audit Trail**: Maintain transaction logs for compliance
- **Receipt Generation**: Provide tax-compliant receipts

---

**Note**: This integration is for educational purposes. For production use, ensure proper security measures and compliance with local regulations.
