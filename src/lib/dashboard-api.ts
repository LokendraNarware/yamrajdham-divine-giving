import { supabase } from '@/integrations/supabase/client';

// Admin Dashboard API Functions
export const adminApi = {
  // Get admin dashboard statistics with optimized queries
  async getDashboardStats() {
    try {
      // Try to use the optimized database function first
      const { data: optimizedStats, error: optimizedError } = await supabase
        .rpc('get_admin_dashboard_stats');

      if (!optimizedError && optimizedStats && (optimizedStats as any).length > 0) {
        const stats = (optimizedStats as any)[0];
        return {
          totalDonations: stats.total_donations,
          totalAmount: stats.total_amount,
          totalUsers: stats.total_users,
          completedDonations: stats.completed_donations,
          pendingDonations: stats.pending_donations,
          failedDonations: stats.failed_donations,
          refundedDonations: stats.refunded_donations,
          systemStatus: stats.system_status as 'healthy' | 'warning' | 'error',
          systemMessage: stats.system_status === 'healthy' ? 'All systems operational' : 'System health check failed',
        };
      }

      // Fallback to the original method if optimized function fails
      console.warn('Optimized stats function failed, falling back to direct queries:', optimizedError);
      
      const [
        completedDonationsResult,
        allDonationsResult,
        usersResult,
        systemHealthResult
      ] = await Promise.allSettled([
        // Optimized query for completed donations only (exclude refunded)
        supabase
          .from('user_donations')
          .select('amount, payment_status')
          .eq('payment_status', 'completed')
          .neq('payment_status', 'refunded'),
        
        // Get payment status counts only
        supabase
          .from('user_donations')
          .select('payment_status'),
        
        // Get user count efficiently
        supabase
          .from('users')
          .select('id', { count: 'exact' }),
        
        // System health check
        supabase
          .from('users')
          .select('id')
          .limit(1)
      ]);

      // Process results
      const completedDonations = completedDonationsResult.status === 'fulfilled' 
        ? completedDonationsResult.value.data || []
        : [];
      
      const allDonations = allDonationsResult.status === 'fulfilled'
        ? allDonationsResult.value.data || []
        : [];
      
      const usersData = usersResult.status === 'fulfilled'
        ? usersResult.value.data || []
        : [];
      
      const systemHealthy = systemHealthResult.status === 'fulfilled' && !systemHealthResult.value.error;

      // Calculate statistics
      const totalDonations = completedDonations.length;
      const totalAmount = (completedDonations as any).reduce((sum: number, d: any) => sum + d.amount, 0);
      const totalUsers = usersData.length;
      
      const statusCounts = (allDonations as any).reduce((acc: any, d: any) => {
        // Exclude refunded donations from status counts
        if (d.payment_status !== 'refunded') {
          acc[d.payment_status] = (acc[d.payment_status] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return {
        totalDonations,
        totalAmount,
        totalUsers,
        completedDonations: statusCounts.completed || 0,
        pendingDonations: statusCounts.pending || 0,
        failedDonations: statusCounts.failed || 0,
        refundedDonations: statusCounts.refunded || 0,
        systemStatus: systemHealthy ? 'healthy' : 'error',
        systemMessage: systemHealthy ? 'All systems operational' : 'System health check failed',
      };
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      throw new Error(`Failed to fetch admin dashboard stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get analytics data with optimized queries (exclude refunded donations)
  async getAnalyticsData() {
    const { data: donationsData, error } = await supabase
      .from('user_donations')
      .select(`
        id,
        amount,
        created_at,
        donation_type,
        user:users(name)
      `)
      .eq('payment_status', 'completed')
      .neq('payment_status', 'refunded') // Exclude refunded donations
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch analytics data: ${error.message}`);
    }

    const donations = donationsData || [];
    const totalRevenue = (donations as any).reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    const totalDonations = donations.length;
    const uniqueDonors = new Set((donations as any).map((d: any) => d.user?.name)).size;
    const averageDonation = totalDonations > 0 ? totalRevenue / totalDonations : 0;

    // Generate monthly trends (last 6 months)
    const monthlyTrends = generateMonthlyTrends(donations);
    
    // Generate donation sources data
    const donationSources = generateDonationSources(donations);

    return {
      totalRevenue,
      totalDonations,
      activeDonors: uniqueDonors,
      averageDonation,
      recentDonations: donations.slice(0, 10),
      monthlyTrends,
      donationSources,
    };
  },

  // Get users with pagination
  async getUsers(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return {
      users: data || [],
      totalCount: count || 0,
      hasMore: (count || 0) > offset + limit,
    };
  },

  // Get donations with pagination and filters (exclude refunded donations by default)
  async getDonations(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('user_donations')
      .select(`
        *,
        user:users(name, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if ((filters as any).status) {
      query = query.eq('payment_status', (filters as any).status);
    } else {
      // By default, exclude refunded donations unless specifically requested
      query = query.neq('payment_status', 'refunded');
    }
    if ((filters as any).startDate) {
      query = query.gte('created_at', (filters as any).startDate);
    }
    if ((filters as any).endDate) {
      query = query.lte('created_at', (filters as any).endDate);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch donations: ${error.message}`);
    }

    return {
      donations: data || [],
      totalCount: count || 0,
      hasMore: (count || 0) > offset + limit,
    };
  },
};

// User Dashboard API Functions
export const userApi = {
  // Get user profile with caching
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    return data;
  },

  // Get user donations with optimized query (exclude refunded donations)
  async getUserDonations(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('user_donations')
      .select('*')
      .eq('user_id', userId)
      .neq('payment_status', 'refunded') // Exclude refunded donations
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch user donations: ${error.message}`);
    }

    return data || [];
  },

  // Get user statistics
  async getUserStats(userId: string) {
    try {
      // Try to use the optimized database function first
      const { data: optimizedStats, error: optimizedError } = await (supabase as any)
        .rpc('get_user_dashboard_stats', { p_user_id: userId });

      if (!optimizedError && optimizedStats && optimizedStats.length > 0) {
        const stats = optimizedStats[0];
        return {
          totalAmount: stats.total_amount,
          totalCount: stats.total_count,
          averageDonation: stats.average_donation,
        };
      }

      // Fallback to the original method if optimized function fails
      console.warn('Optimized user stats function failed, falling back to direct query:', optimizedError);
      
      const { data, error } = await supabase
        .from('user_donations')
        .select('amount, payment_status')
        .eq('user_id', userId)
        .eq('payment_status', 'completed')
        .neq('payment_status', 'refunded'); // Double-check: exclude refunded donations

      if (error) {
        throw new Error(`Failed to fetch user stats: ${error.message}`);
      }

      const donations = data || [];
      const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
      const totalCount = donations.length;

      return {
        totalAmount,
        totalCount,
        averageDonation: totalCount > 0 ? totalAmount / totalCount : 0,
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error(`Failed to fetch user stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Public Data API Functions (for homepage, etc.)
export const publicApi = {
  // Get donation categories (rarely change)
  async getDonationCategories() {
    const { data, error } = await supabase
      .from('donation_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      throw new Error(`Failed to fetch donation categories: ${error.message}`);
    }

    return data || [];
  },

  // Get construction milestones
  async getConstructionMilestones() {
    const { data, error } = await supabase
      .from('construction_milestones')
      .select('*')
      .order('sort_order');

    if (error) {
      throw new Error(`Failed to fetch construction milestones: ${error.message}`);
    }

    return data || [];
  },

  // Get project settings
  async getProjectSettings() {
    const { data, error } = await supabase
      .from('project_settings')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch project settings: ${error.message}`);
    }

    // Convert to key-value object for easier access
    const settings = (data || []).reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return settings;
  },

  // Get recent donations for display
  async getRecentDonations(limit = 10) {
    const { data, error } = await supabase
      .from('recent_donations')
      .select('*')
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent donations: ${error.message}`);
    }

    return data || [];
  },
};

// Helper functions
function generateMonthlyTrends(donations: any[]) {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      amount: 0,
    };
  }).reverse();

  donations.forEach(donation => {
    const date = new Date(donation.created_at);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const trend = last6Months.find(t => t.month === monthKey);
    if (trend) {
      trend.amount += donation.amount || 0;
    }
  });

  return last6Months;
}

function generateDonationSources(donations: any[]) {
  const sources = donations.reduce((acc, donation) => {
    const type = donation.donation_type || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
  
  return Object.entries(sources).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length],
  }));
}
