// Cashfree Payment Gateway Configuration
// Replace these with your actual Cashfree credentials from https://merchant.cashfree.com/

export const CASHFREE_CONFIG = {
  // Get these from your Cashfree Dashboard
  APP_ID: import.meta.env.VITE_CASHFREE_APP_ID || 'demo_app_id',
  SECRET_KEY: import.meta.env.VITE_CASHFREE_SECRET_KEY || 'demo_secret_key',
  
  // Environment: 'sandbox' for testing, 'production' for live
  ENVIRONMENT: import.meta.env.VITE_CASHFREE_ENVIRONMENT || 'sandbox',
  
  // Base URLs
  BASE_URL: import.meta.env.VITE_CASHFREE_ENVIRONMENT === 'production' 
    ? 'https://api.cashfree.com' 
    : 'https://sandbox.cashfree.com',
    
  // Demo mode for testing without credentials
  DEMO_MODE: !import.meta.env.VITE_CASHFREE_APP_ID || import.meta.env.VITE_CASHFREE_APP_ID === 'demo_app_id',
};

// Instructions for setup:
// 1. Sign up at https://www.cashfree.com/
// 2. Go to Dashboard > Settings > API Keys
// 3. Copy your App ID and Secret Key
// 4. Create a .env file in your project root with:
//    VITE_CASHFREE_APP_ID=your_actual_app_id
//    VITE_CASHFREE_SECRET_KEY=your_actual_secret_key
//    VITE_CASHFREE_ENVIRONMENT=sandbox
// 5. For production, change VITE_CASHFREE_ENVIRONMENT=production
