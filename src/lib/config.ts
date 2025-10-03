/**
 * Configuration management for the donation platform
 * Centralizes all configuration values and environment-specific settings
 */

export interface AppConfig {
  // Application settings
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    siteUrl: string;
    supportEmail: string;
  };

  // Database settings
  database: {
    maxRetries: number;
    retryDelay: number;
    connectionTimeout: number;
  };

  // Payment gateway settings
  payment: {
    defaultCurrency: string;
    supportedCurrencies: string[];
    minAmount: number;
    maxAmount: number;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };

  // Webhook settings
  webhook: {
    signatureTimeout: number;
    maxRetries: number;
    retryDelay: number;
    allowedOrigins: string[];
  };

  // Security settings
  security: {
    rateLimitWindow: number;
    rateLimitMax: number;
    sessionTimeout: number;
    passwordMinLength: number;
  };

  // Email settings
  email: {
    fromAddress: string;
    replyTo: string;
    templates: {
      donationConfirmation: string;
      receipt: string;
      welcome: string;
    };
  };

  // File upload settings
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
    uploadPath: string;
  };

  // Cache settings
  cache: {
    defaultTtl: number;
    maxSize: number;
    cleanupInterval: number;
  };

  // Logging settings
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    maxFileSize: number;
    maxFiles: number;
    enableConsole: boolean;
  };
}

// Default configuration
const defaultConfig: AppConfig = {
  app: {
    name: 'Yamraj Dham Divine Giving',
    version: '1.0.0',
    environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    supportEmail: 'support@yamrajdham.com',
  },

  database: {
    maxRetries: 3,
    retryDelay: 1000,
    connectionTimeout: 30000,
  },

  payment: {
    defaultCurrency: 'INR',
    supportedCurrencies: ['INR', 'USD', 'EUR'],
    minAmount: 1,
    maxAmount: 1000000,
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 2000,
  },

  webhook: {
    signatureTimeout: 300000, // 5 minutes
    maxRetries: 5,
    retryDelay: 1000,
    allowedOrigins: ['https://api.cashfree.com', 'https://sandbox.cashfree.com'],
  },

  security: {
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    passwordMinLength: 8,
  },

  email: {
    fromAddress: 'noreply@yamrajdham.com',
    replyTo: 'support@yamrajdham.com',
    templates: {
      donationConfirmation: 'donation-confirmation',
      receipt: 'donation-receipt',
      welcome: 'welcome',
    },
  },

  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    uploadPath: '/uploads',
  },

  cache: {
    defaultTtl: 300, // 5 minutes
    maxSize: 1000,
    cleanupInterval: 60000, // 1 minute
  },

  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    enableConsole: process.env.NODE_ENV !== 'production',
  },
};

// Environment-specific overrides
const environmentOverrides: Record<string, Partial<AppConfig>> = {
  development: {
    logging: {
      level: 'debug',
      maxFileSize: 5 * 1024 * 1024, // 5MB for dev
      maxFiles: 3,
      enableConsole: true,
    },
    database: {
      maxRetries: 1,
      retryDelay: 500,
      connectionTimeout: 10000, // 10 seconds
    },
  },
  staging: {
    logging: {
      level: 'info',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      enableConsole: true,
    },
  },
  production: {
    logging: {
      level: 'warn',
      maxFileSize: 20 * 1024 * 1024, // 20MB
      maxFiles: 10,
      enableConsole: false,
    },
    security: {
      rateLimitWindow: 15 * 60 * 1000, // 15 minutes
      rateLimitMax: 50,
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
      passwordMinLength: 8,
    },
  },
};

// Merge configuration with environment-specific overrides
function mergeConfig(base: AppConfig, overrides: Partial<AppConfig>): AppConfig {
  return {
    ...base,
    ...overrides,
    app: { ...base.app, ...overrides.app },
    database: { ...base.database, ...overrides.database },
    payment: { ...base.payment, ...overrides.payment },
    webhook: { ...base.webhook, ...overrides.webhook },
    security: { ...base.security, ...overrides.security },
    email: { ...base.email, ...overrides.email },
    upload: { ...base.upload, ...overrides.upload },
    cache: { ...base.cache, ...overrides.cache },
    logging: { ...base.logging, ...overrides.logging },
  };
}

// Get environment-specific configuration
const environment = process.env.NODE_ENV as keyof typeof environmentOverrides;
const config = mergeConfig(defaultConfig, environmentOverrides[environment] || {});

// Export configuration
export { config };

// Export individual configuration sections for convenience
export const {
  app: appConfig,
  database: dbConfig,
  payment: paymentConfig,
  webhook: webhookConfig,
  security: securityConfig,
  email: emailConfig,
  upload: uploadConfig,
  cache: cacheConfig,
  logging: loggingConfig,
} = config;

// Configuration validation
export function validateConfig(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'CASHFREE_APP_ID',
    'CASHFREE_SECRET_KEY',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate configuration values
  if (config.payment.minAmount < 1) {
    throw new Error('Minimum payment amount must be at least 1');
  }

  if (config.payment.maxAmount <= config.payment.minAmount) {
    throw new Error('Maximum payment amount must be greater than minimum amount');
  }

  if (config.security.passwordMinLength < 6) {
    throw new Error('Password minimum length must be at least 6 characters');
  }
}

// Initialize configuration validation
if (typeof window === 'undefined') {
  // Only validate on server side
  try {
    validateConfig();
  } catch (error) {
    console.error('Configuration validation failed:', error);
    process.exit(1);
  }
}
