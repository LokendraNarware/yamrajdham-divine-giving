import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // Get analytics data for the dashboard
    const [
      monthlyTrendsResult,
      categoryBreakdownResult,
      topDonorsResult
    ] = await Promise.allSettled([
      // Monthly trends for last 6 months
      supabase
        .from('user_donations')
        .select('amount, created_at')
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
      const monthlyData: Record<string, { amount: number; count: number }> = {};

      (donations as Array<{created_at: string, amount: number}>).forEach(donation => {
        const month = new Date(donation.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
        if (!monthlyData[month]) {
          monthlyData[month] = { amount: 0, count: 0 };
        }
        monthlyData[month].amount += donation.amount;
        monthlyData[month].count += 1;
      });

      // Generate last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyTrends.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          amount: monthlyData[monthKey]?.amount || 0,
          donations: monthlyData[monthKey]?.count || 0
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
