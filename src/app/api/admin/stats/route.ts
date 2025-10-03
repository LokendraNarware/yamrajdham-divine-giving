import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Convert date strings to timestamps if provided
    const startTimestamp = startDate ? new Date(startDate).toISOString() : null;
    const endTimestamp = endDate ? new Date(endDate).toISOString() : null;
    
    // Try to use the date-filtered database function first if dates are provided
    if (startTimestamp || endTimestamp) {
      const { data: filteredStats, error: filteredError } = await (supabase as any)
        .rpc('get_admin_dashboard_stats_filtered', {
          start_date: startTimestamp,
          end_date: endTimestamp
        });

      if (!filteredError && filteredStats && (filteredStats as Array<any>).length > 0) {
        const stats = (filteredStats as Array<any>)[0];
        return NextResponse.json({
          totalDonations: stats.total_donations,
          totalAmount: stats.total_amount,
          totalUsers: stats.total_users,
          completedDonations: stats.completed_donations,
          pendingDonations: stats.pending_donations,
          failedDonations: stats.failed_donations,
          refundedDonations: stats.refunded_donations,
          systemStatus: stats.system_status as 'healthy' | 'warning' | 'error',
          systemMessage: stats.system_status === 'healthy' ? 'All systems operational' : 'System health check failed',
          dateRange: {
            startDate: startTimestamp,
            endDate: endTimestamp
          }
        });
      }
    }
    
    // Try to use the optimized database function first
    const { data: optimizedStats, error: optimizedError } = await supabase
      .rpc('get_admin_dashboard_stats');

    if (!optimizedError && optimizedStats && (optimizedStats as Array<any>).length > 0) {
      const stats = (optimizedStats as Array<any>)[0];
      return NextResponse.json({
        totalDonations: stats.total_donations,
        totalAmount: stats.total_amount,
        totalUsers: stats.total_users,
        completedDonations: stats.completed_donations,
        pendingDonations: stats.pending_donations,
        failedDonations: stats.failed_donations,
        refundedDonations: stats.refunded_donations,
        systemStatus: stats.system_status as 'healthy' | 'warning' | 'error',
        systemMessage: stats.system_status === 'healthy' ? 'All systems operational' : 'System health check failed',
      });
    }

    // Fallback to direct queries if optimized function fails
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
    const totalAmount = (completedDonations as Array<{amount: number}>).reduce((sum, d) => sum + d.amount, 0);
    const totalUsers = usersData.length;
    
    const statusCounts = (allDonations as Array<{payment_status: string}>).reduce((acc, d) => {
      // Exclude refunded donations from status counts
      if (d.payment_status !== 'refunded') {
        acc[d.payment_status] = (acc[d.payment_status] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      totalDonations,
      totalAmount,
      totalUsers,
      completedDonations: statusCounts.completed || 0,
      pendingDonations: statusCounts.pending || 0,
      failedDonations: statusCounts.failed || 0,
      refundedDonations: statusCounts.refunded || 0,
      systemStatus: systemHealthy ? 'healthy' : 'error',
      systemMessage: systemHealthy ? 'All systems operational' : 'System health check failed',
    });

  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin dashboard stats' },
      { status: 500 }
    );
  }
}
