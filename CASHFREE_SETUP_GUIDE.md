# Environment Setup for Cashfree Hosted Checkout

## Quick Setup

Create a `.env.local` file in your project root with the following content:

```env
# Supabase Configuration (already set)
NEXT_PUBLIC_SUPABASE_URL=https://dxdfgaymlhcqxjsuwhoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ZGZnYXltbGhjcXhqc3V3aG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NjA1NzYsImV4cCI6MjA3NDIzNjU3Nn0.nqFqNySt2GMN-LAqfDUiW-UtcpeF1iDAsF_T8SJeMSE

# Cashfree API Credentials (TEST CREDENTIALS - WORKING)
CASHFREE_APP_ID=TEST10758970030978c58449ce8e073107985701
CASHFREE_SECRET_KEY=cfsk_ma_test_180b2c26eda0cf5a0750b646047f7dd4_5f14dbaf
CASHFREE_ENVIRONMENT=sandbox
CASHFREE_WEBHOOK_SECRET=test_webhook_secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
```

## Test Payment Methods

The following payment methods are now enabled:
- **cc** - Credit Cards (Visa, Mastercard, RuPay, Amex)
- **dc** - Debit Cards
- **upi** - UPI (PhonePe, Google Pay, Paytm, BHIM)
- **nb** - Net Banking (All major banks)
- **app** - Wallets (Paytm, PhonePe, Mobikwik)

## Test Cards

- **Success Card**: `4111 1111 1111 1111`
- **CVV**: `123`
- **Expiry**: Any future date (e.g., `12/25`)

## How to Test

1. Start your development server: `pnpm dev`
2. Go to `http://localhost:3000/donate`
3. Fill in donation details
4. Click "Pay" button
5. You should see either:
   - Hosted checkout popup (if SDK loads properly)
   - Direct redirect to Cashfree payment page (fallback)

## Troubleshooting

If you see "Payment gateway failed to load" error:
1. Check browser console for errors
2. Ensure Cashfree SDK script is loaded
3. The system will automatically fallback to direct redirect

## Production Setup

For production, replace the test credentials with your actual Cashfree production credentials:
- Get production credentials from Cashfree Dashboard
- Set `CASHFREE_ENVIRONMENT=production`
- Set `NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production`
- Update `NEXT_PUBLIC_SITE_URL` to your production domain
