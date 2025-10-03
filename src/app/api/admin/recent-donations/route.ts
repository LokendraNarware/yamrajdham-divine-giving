import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Convert date strings to timestamps if provided
    const startTimestamp = startDate ? new Date(startDate).toISOString() : null;
    const endTimestamp = endDate ? new Date(endDate).toISOString() : null;
    
    // Try to use the date-filtered database function first if dates are provided
    if (startTimestamp || endTimestamp) {
      const { data: filteredDonations, error: filteredError } = await supabase
        .rpc('get_recent_donations_filtered', {
          start_date: startTimestamp,
          end_date: endTimestamp,
          limit_count: limit
        });

      if (!filteredError && filteredDonations && (filteredDonations as Array<any>).length > 0) {
        const result = (filteredDonations as Array<any>)[0];
        return NextResponse.json({
          donations: result.donations || [],
          total: (result.donations || []).length,
          dateRange: {
            startDate: startTimestamp,
            endDate: endTimestamp
          }
        });
      }
    }

    // Get recent completed donations with user information
    const { data: donations, error } = await supabase
      .from('user_donations')
      .select(`
        id,
        amount,
        donation_type,
        created_at,
        is_anonymous,
        user:users(name)
      `)
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent donations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch recent donations' },
        { status: 500 }
      );
    }

    // Transform data for the component
    const transformedDonations = (donations as Array<{id: string, amount: number, is_anonymous: boolean, user?: {name: string}, donation_type?: string, created_at: string}> || []).map(donation => ({
      id: donation.id,
      amount: donation.amount,
      donor_name: donation.is_anonymous ? 'Anonymous' : (donation.user?.name || 'Unknown'),
      donation_type: donation.donation_type || 'General Donation',
      created_at: donation.created_at,
      is_anonymous: donation.is_anonymous
    }));

    return NextResponse.json({
      donations: transformedDonations,
      total: transformedDonations.length
    });

  } catch (error) {
    console.error('Error in recent donations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
