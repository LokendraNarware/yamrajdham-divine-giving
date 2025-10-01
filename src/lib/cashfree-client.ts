/**
 * Cashfree Frontend Client for Hosted Checkout
 * Handles initialization and checkout operations
 */

// Global Cashfree type declaration
declare global {
  interface Window {
    Cashfree: {
      (config: { mode: string }): {
        checkout: (options: {
          paymentSessionId: string;
          redirectTarget?: '_self' | '_blank' | '_top' | '_modal' | HTMLElement;
        }) => Promise<any> | void;
      };
    };
  }
}

export interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: '_self' | '_blank' | '_top' | '_modal' | HTMLElement;
}

export interface CashfreeConfig {
  mode: 'sandbox' | 'production';
}

/**
 * Initialize Cashfree SDK
 * @param config Configuration object
 * @returns Cashfree instance or null if not available
 */
export const initializeCashfree = (config: CashfreeConfig) => {
  if (typeof window === 'undefined') {
    console.warn('Cashfree SDK can only be initialized on the client side');
    return null;
  }

  if (!window.Cashfree) {
    console.error('Cashfree SDK not loaded. Make sure the script is included in your HTML.');
    return null;
  }

  try {
    const cashfree = window.Cashfree({
      mode: config.mode
    });
    
    console.log('Cashfree SDK initialized successfully with mode:', config.mode);
    return cashfree;
  } catch (error) {
    console.error('Failed to initialize Cashfree SDK:', error);
    return null;
  }
};

/**
 * Open Cashfree hosted checkout
 * @param cashfreeInstance Initialized Cashfree instance
 * @param options Checkout options
 * @returns Promise that resolves when checkout is completed (for popup/modal)
 */
export const openCashfreeCheckout = async (
  cashfreeInstance: any,
  options: CashfreeCheckoutOptions
): Promise<any> => {
  if (!cashfreeInstance) {
    throw new Error('Cashfree instance not initialized');
  }

  if (!options.paymentSessionId) {
    throw new Error('Payment session ID is required');
  }

  try {
    console.log('Opening Cashfree checkout with options:', options);
    
    const result = cashfreeInstance.checkout({
      paymentSessionId: options.paymentSessionId,
      redirectTarget: options.redirectTarget || '_self'
    });

    // For popup/modal checkout, return the promise
    if (options.redirectTarget === '_modal' || options.redirectTarget === '_blank') {
      return result;
    }

    // For redirect checkout, return immediately
    return result;
  } catch (error) {
    console.error('Failed to open Cashfree checkout:', error);
    throw error;
  }
};

/**
 * Get default Cashfree configuration based on environment
 * @returns Cashfree configuration
 */
export const getCashfreeConfig = (): CashfreeConfig => {
  const environment = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'sandbox';
  return {
    mode: environment === 'production' ? 'production' : 'sandbox'
  };
};

/**
 * Utility function to check if Cashfree SDK is available
 * @returns boolean indicating if SDK is loaded
 */
export const isCashfreeAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!window.Cashfree;
};

/**
 * Wait for Cashfree SDK to load
 * @param timeout Maximum time to wait in milliseconds
 * @returns Promise that resolves when SDK is available
 */
export const waitForCashfree = (timeout: number = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isCashfreeAvailable()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isCashfreeAvailable()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};
