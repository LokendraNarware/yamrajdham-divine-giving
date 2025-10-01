// Cashfree Payment Gateway Configuration
export const CASHFREE_CONFIG = {
  // Cashfree credentials
  APP_ID: process.env.CASHFREE_APP_ID || '',
  SECRET_KEY: process.env.CASHFREE_SECRET_KEY || '',
  
  // Environment: 'sandbox' for testing, 'production' for live
  ENVIRONMENT: process.env.CASHFREE_ENVIRONMENT || 'sandbox',
  
  // Base URLs
  BASE_URL: (process.env.CASHFREE_ENVIRONMENT || 'sandbox') === 'production' 
    ? 'https://api.cashfree.com' 
    : 'https://sandbox.cashfree.com',
    
  // API Version
  API_VERSION: '2023-08-01', // Standard version
};

// Debug configuration on startup
if (typeof window === 'undefined') {
  console.log('=== CASHFREE CONFIGURATION ===');
  console.log('Environment:', CASHFREE_CONFIG.ENVIRONMENT);
  console.log('Base URL:', CASHFREE_CONFIG.BASE_URL);
  console.log('App ID configured:', !!CASHFREE_CONFIG.APP_ID);
  console.log('Secret Key configured:', !!CASHFREE_CONFIG.SECRET_KEY);
  console.log('App ID (first 10 chars):', CASHFREE_CONFIG.APP_ID.substring(0, 10) + '...');
}
