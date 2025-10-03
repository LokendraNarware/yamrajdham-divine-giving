# Environment Setup for Cashfree Hosted Checkout

## Quick Setup

Create a `.env.local` file in your project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cashfree API Credentials
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENVIRONMENT=sandbox
CASHFREE_WEBHOOK_SECRET=your_webhook_secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yamrajdham.com
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
2. Go to `https://yamrajdham.com/donate`
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
