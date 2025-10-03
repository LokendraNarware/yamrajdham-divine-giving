/**
 * Logger utility for conditional logging based on environment
 * Prevents console.log statements in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

// For production error logging, you might want to use a service like Sentry
export const logError = (error: Error, context?: string) => {
  if (isDevelopment) {
    console.error(`[${context || 'Error'}]:`, error);
  } else {
    // In production, send to error monitoring service
    // Example: Sentry.captureException(error, { tags: { context } });
  }
};
