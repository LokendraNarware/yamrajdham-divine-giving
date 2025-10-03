/**
 * Database service layer for common operations
 * Reduces code duplication and provides consistent error handling
 */

import { supabase } from '@/integrations/supabase/client';
import { UserDonation, User, SupabaseResponse } from '@/types/donation';
import { logger } from '@/lib/structured-logger';

export class DatabaseService {
  /**
   * Generic method to find a single record by field
   */
  static async findOne<T>(
    table: string,
    field: string,
    value: string,
    selectFields: string = '*'
  ): Promise<SupabaseResponse<T>> {
    try {
      const { data, error } = await (supabase as any)
        .from(table)
        .select(selectFields)
        .eq(field, value)
        .single();

      if (error) {
        logger.databaseError(`Failed to find ${table} by ${field}`, {
          table,
          field,
          value,
          error: error.message,
        });
      }

      return { data, error };
    } catch (err) {
      logger.databaseError(`Exception in findOne for ${table}`, {
        table,
        field,
        value,
        error: err,
      });
      return { data: null, error: err as any };
    }
  }

  /**
   * Generic method to find multiple records by field
   */
  static async findMany<T>(
    table: string,
    field: string,
    value: string,
    selectFields: string = '*',
    orderBy?: { column: string; ascending?: boolean }
  ): Promise<SupabaseResponse<T[]>> {
    try {
      let query = (supabase as any)
        .from(table)
        .select(selectFields)
        .eq(field, value);

      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      const { data, error } = await query;

      if (error) {
        logger.databaseError(`Failed to find multiple ${table} by ${field}`, {
          table,
          field,
          value,
          error: error.message,
        });
      }

      return { data: data || [], error };
    } catch (err) {
      logger.databaseError(`Exception in findMany for ${table}`, {
        table,
        field,
        value,
        error: err,
      });
      return { data: [], error: err as any };
    }
  }

  /**
   * Generic method to update a record
   */
  static async updateOne<T>(
    table: string,
    id: string,
    updateData: Record<string, any>
  ): Promise<SupabaseResponse<T>> {
    try {
      const { data, error } = await (supabase as any)
        .from(table)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.databaseError(`Failed to update ${table}`, {
          table,
          id,
          updateData,
          error: error.message,
        });
      } else {
        logger.info(`Successfully updated ${table}`, {
          table,
          id,
          updateData,
        });
      }

      return { data, error };
    } catch (err) {
      logger.databaseError(`Exception in updateOne for ${table}`, {
        table,
        id,
        updateData,
        error: err,
      });
      return { data: null, error: err as any };
    }
  }

  /**
   * Generic method to insert a record
   */
  static async insertOne<T>(
    table: string,
    insertData: Record<string, any>
  ): Promise<SupabaseResponse<T>> {
    try {
      const { data, error } = await (supabase as any)
        .from(table)
        .insert(insertData)
        .select()
        .single();

      if (error) {
        logger.databaseError(`Failed to insert ${table}`, {
          table,
          insertData,
          error: error.message,
        });
      } else {
        logger.info(`Successfully inserted ${table}`, {
          table,
          insertData,
          id: data?.id,
        });
      }

      return { data, error };
    } catch (err) {
      logger.databaseError(`Exception in insertOne for ${table}`, {
        table,
        insertData,
        error: err,
      });
      return { data: null, error: err as any };
    }
  }

  /**
   * Generic method to delete a record
   */
  static async deleteOne(
    table: string,
    id: string
  ): Promise<SupabaseResponse<null>> {
    try {
      const { error } = await (supabase as any)
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        logger.databaseError(`Failed to delete ${table}`, {
          table,
          id,
          error: error.message,
        });
      } else {
        logger.info(`Successfully deleted ${table}`, {
          table,
          id,
        });
      }

      return { data: null, error };
    } catch (err) {
      logger.databaseError(`Exception in deleteOne for ${table}`, {
        table,
        id,
        error: err,
      });
      return { data: null, error: err as any };
    }
  }

  /**
   * Execute raw SQL query
   */
  static async executeQuery<T>(
    query: string,
    params?: any[]
  ): Promise<SupabaseResponse<T[]>> {
    try {
      const { data, error } = await (supabase as any).rpc('execute_sql', {
        query,
        params: params || [],
      });

      if (error) {
        logger.databaseError('Failed to execute SQL query', {
          query,
          params,
          error: error.message,
        });
      }

      return { data: data || [], error };
    } catch (err) {
      logger.databaseError('Exception in executeQuery', {
        query,
        params,
        error: err,
      });
      return { data: [], error: err as any };
    }
  }
}

// Specialized service classes for specific entities
export class DonationService {
  /**
   * Find donation by Cashfree order ID
   */
  static async findByCashfreeOrderId(orderId: string): Promise<SupabaseResponse<UserDonation>> {
    return DatabaseService.findOne<UserDonation>('user_donations', 'cashfree_order_id', orderId);
  }

  /**
   * Find donation by payment ID
   */
  static async findByPaymentId(paymentId: string): Promise<SupabaseResponse<UserDonation>> {
    return DatabaseService.findOne<UserDonation>('user_donations', 'payment_id', paymentId);
  }

  /**
   * Find donation by ID
   */
  static async findById(id: string): Promise<SupabaseResponse<UserDonation>> {
    return DatabaseService.findOne<UserDonation>('user_donations', 'id', id);
  }

  /**
   * Update donation payment status
   */
  static async updatePaymentStatus(
    id: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded',
    additionalData: Record<string, any> = {}
  ): Promise<SupabaseResponse<UserDonation>> {
    const updateData = {
      payment_status: status,
      last_verified_at: new Date().toISOString(),
      ...additionalData,
    };
    return DatabaseService.updateOne<UserDonation>('user_donations', id, updateData);
  }

  /**
   * Create new donation
   */
  static async create(donationData: Partial<UserDonation>): Promise<SupabaseResponse<UserDonation>> {
    return DatabaseService.insertOne<UserDonation>('user_donations', donationData);
  }

  /**
   * Get donations by user ID
   */
  static async findByUserId(userId: string): Promise<SupabaseResponse<UserDonation[]>> {
    return DatabaseService.findMany<UserDonation>(
      'user_donations',
      'user_id',
      userId,
      '*',
      { column: 'created_at', ascending: false }
    );
  }

  /**
   * Get completed donations
   */
  static async getCompletedDonations(): Promise<SupabaseResponse<UserDonation[]>> {
    return DatabaseService.findMany<UserDonation>(
      'user_donations',
      'payment_status',
      'completed',
      '*',
      { column: 'created_at', ascending: false }
    );
  }
}

export class UserService {
  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<SupabaseResponse<User>> {
    return DatabaseService.findOne<User>('users', 'email', email);
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<SupabaseResponse<User>> {
    return DatabaseService.findOne<User>('users', 'id', id);
  }

  /**
   * Create new user
   */
  static async create(userData: Partial<User>): Promise<SupabaseResponse<User>> {
    return DatabaseService.insertOne<User>('users', userData);
  }

  /**
   * Update user
   */
  static async update(id: string, userData: Partial<User>): Promise<SupabaseResponse<User>> {
    return DatabaseService.updateOne<User>('users', id, userData);
  }

  /**
   * Get all users
   */
  static async getAll(): Promise<SupabaseResponse<User[]>> {
    return DatabaseService.findMany<User>('users', 'id', 'not-null', '*');
  }
}

// Utility functions for common operations
export class DatabaseUtils {
  /**
   * Retry operation with exponential backoff
   */
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries - 1) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(`Database operation failed, retrying in ${delay}ms`, {
          attempt: attempt + 1,
          maxRetries,
          error: error,
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  /**
   * Execute multiple operations in a transaction-like manner
   */
  static async executeTransaction<T>(
    operations: Array<() => Promise<any>>
  ): Promise<SupabaseResponse<T[]>> {
    const results: any[] = [];
    
    try {
      for (const operation of operations) {
        const result = await operation();
        if (result.error) {
          throw result.error;
        }
        results.push(result.data);
      }
      
      return { data: results, error: null };
    } catch (error) {
      logger.databaseError('Transaction failed', {
        operationsCount: operations.length,
        completedOperations: results.length,
        error,
      });
      
      return { data: [], error: error as any };
    }
  }

  /**
   * Check if error is a "not found" error
   */
  static isNotFoundError(error: any): boolean {
    return error?.code === 'PGRST116' || error?.message?.includes('No rows found');
  }

  /**
   * Check if error is a duplicate key error
   */
  static isDuplicateError(error: any): boolean {
    return error?.code === '23505' || error?.message?.includes('duplicate');
  }
}
