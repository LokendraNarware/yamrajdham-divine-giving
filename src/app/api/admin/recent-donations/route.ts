import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

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
