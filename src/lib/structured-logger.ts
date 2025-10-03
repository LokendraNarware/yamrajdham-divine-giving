/**
 * Structured logging system for the donation platform
 * Replaces console.log statements with proper logging levels
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  userId?: string;
  donationId?: string;
  orderId?: string;
  paymentId?: string;
  eventType?: string;
  operation?: string;
  [key: string]: any;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level}: ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, context));
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, context));
    }
  }

  // Specialized logging methods for different operations
  webhookReceived(context: LogContext): void {
    this.info('Webhook received', context);
  }

  webhookProcessed(context: LogContext): void {
    this.info('Webhook processed successfully', context);
  }

  webhookError(message: string, context: LogContext): void {
    this.error(`Webhook error: ${message}`, context);
  }

  donationCreated(context: LogContext): void {
    this.info('Donation created', context);
  }

  donationUpdated(context: LogContext): void {
    this.info('Donation updated', context);
  }

  paymentSessionCreated(context: LogContext): void {
    this.info('Payment session created', context);
  }

  userCreated(context: LogContext): void {
    this.info('User account created', context);
  }

  databaseError(message: string, context: LogContext): void {
    this.error(`Database error: ${message}`, context);
  }

  validationError(message: string, context: LogContext): void {
    this.warn(`Validation error: ${message}`, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export individual methods for convenience
export const { debug, info, warn, error, webhookReceived, webhookProcessed, webhookError, donationCreated, donationUpdated, paymentSessionCreated, userCreated, databaseError, validationError } = logger;
