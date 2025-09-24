// Cashfree Payment Gateway Configuration
export const CASHFREE_CONFIG = {
  // Cashfree credentials - Using sandbox credentials by default
  APP_ID: process.env.CASHFREE_APP_ID || 'TEST10758970030978c58449ce8e073107985701',
  SECRET_KEY: process.env.CASHFREE_SECRET_KEY || 'cfsk_ma_test_180b2c26eda0cf5a0750b646047f7dd4_5f14dbaf',
  
  // Environment: 'sandbox' for testing, 'production' for live
  ENVIRONMENT: process.env.CASHFREE_ENVIRONMENT || 'sandbox',
  
  // Base URLs
  BASE_URL: (process.env.CASHFREE_ENVIRONMENT || 'sandbox') === 'production' 
    ? 'https://api.cashfree.com' 
    : 'https://sandbox.cashfree.com',
    
  // API Version
  API_VERSION: '2023-08-01', // Standard version
  
  // Demo mode for testing without credentials
  DEMO_MODE: false, // Set to false since we have real production credentials
};
