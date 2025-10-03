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
      const { data: filteredAnalytics, error: filteredError } = await (supabase as any)
        .rpc('get_admin_analytics_filtered', {
          start_date: startTimestamp,
          end_date: endTimestamp
        });

      if (!filteredError && filteredAnalytics && (filteredAnalytics as Array<any>).length > 0) {
        const analytics = (filteredAnalytics as Array<any>)[0];
        return NextResponse.json({
          monthlyTrends: analytics.monthly_trends || [],
          categoryBreakdown: analytics.category_breakdown || [],
          topDonors: analytics.top_donors || [],
          dateRange: {
            startDate: startTimestamp,
            endDate: endTimestamp
          },
          success: true
        });
      }
    }
    
    // Get analytics data for the dashboard
    const [
      monthlyTrendsResult,
      categoryBreakdownResult,
      topDonorsResult
    ] = await Promise.allSettled([
      // Monthly trends for last 6 months
      supabase
        .from('user_donations')
        .select('amount, created_at, user_id')
        .eq('payment_status', 'completed')
        .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true }),

      // Category breakdown
      supabase
        .from('user_donations')
        .select('donation_type, amount')
        .eq('payment_status', 'completed')
        .not('donation_type', 'is', null),

      // Top donors (non-anonymous)
      supabase
        .from('user_donations')
        .select(`
          amount,
          is_anonymous,
          user:users(name)
        `)
        .eq('payment_status', 'completed')
        .eq('is_anonymous', false)
        .order('amount', { ascending: false })
        .limit(10)
    ]);

    // Process monthly trends
    const monthlyTrends = [];
    if (monthlyTrendsResult.status === 'fulfilled' && monthlyTrendsResult.value.data) {
      const donations = monthlyTrendsResult.value.data;
      const monthlyData: Record<string, { amount: number; count: number; uniqueDonors: Set<string> }> = {};

      (donations as Array<{created_at: string, amount: number, user_id: string}>).forEach(donation => {
        const month = new Date(donation.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
        if (!monthlyData[month]) {
          monthlyData[month] = { amount: 0, count: 0, uniqueDonors: new Set() };
        }
        monthlyData[month].amount += donation.amount;
        monthlyData[month].count += 1;
        monthlyData[month].uniqueDonors.add(donation.user_id);
      });

      // Generate last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyTrends.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          amount: monthlyData[monthKey]?.amount || 0,
          donations: monthlyData[monthKey]?.count || 0,
          donors: monthlyData[monthKey]?.uniqueDonors.size || 0
        });
      }
    }

    // Process category breakdown
    const categoryBreakdown = [];
    if (categoryBreakdownResult.status === 'fulfilled' && categoryBreakdownResult.value.data) {
      const donations = categoryBreakdownResult.value.data;
      const categoryData: Record<string, { amount: number; count: number }> = {};

      (donations as Array<{donation_type?: string, amount: number}>).forEach(donation => {
        const category = donation.donation_type || 'Other';
        if (!categoryData[category]) {
          categoryData[category] = { amount: 0, count: 0 };
        }
        categoryData[category].amount += donation.amount;
        categoryData[category].count += 1;
      });

      const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
      categoryBreakdown.push(...Object.entries(categoryData).map(([name, data], index) => ({
        name,
        value: data.count,
        amount: data.amount,
        color: colors[index % colors.length]
      })));
    }

    // Process top donors
    const topDonors = [];
    if (topDonorsResult.status === 'fulfilled' && topDonorsResult.value.data) {
      const donations = topDonorsResult.value.data;
      const donorData: Record<string, { amount: number; count: number }> = {};

      (donations as Array<{user?: {name: string}, amount: number}>).forEach(donation => {
        const donorName = donation.user?.name || 'Unknown';
        if (!donorData[donorName]) {
          donorData[donorName] = { amount: 0, count: 0 };
        }
        donorData[donorName].amount += donation.amount;
        donorData[donorName].count += 1;
      });

      topDonors.push(...Object.entries(donorData)
        .map(([name, data]) => ({ name, amount: data.amount, count: data.count }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
      );
    }

    return NextResponse.json({
      monthlyTrends,
      categoryBreakdown,
      topDonors,
      success: true
    });

  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
