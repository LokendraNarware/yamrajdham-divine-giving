// Cashfree Payment Gateway Configuration
export const CASHFREE_CONFIG = {
  // Cashfree credentials
  APP_ID: process.env.CASHFREE_APP_ID || '',
  SECRET_KEY: process.env.CASHFREE_SECRET_KEY || '',
  
  // Environment: 'sandbox' for testing, 'production' for live
  ENVIRONMENT: process.env.CASHFREE_ENVIRONMENT || 'production',
  
  // Base URLs
  BASE_URL: (process.env.CASHFREE_ENVIRONMENT || 'production') === 'production' 
    ? 'https://api.cashfree.com' 
    : 'https://sandbox.cashfree.com',
    
  // API Version
  API_VERSION: '2023-08-01', // Standard version
};
