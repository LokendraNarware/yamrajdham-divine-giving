import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // For now, we'll simulate payment verification
    // In a real implementation, you would call Cashfree's verification API

    // Check if donation exists in database
    // We pass donation.id as orderId in our flow; fall back to payment_id if needed
    let { data: donation, error } = await supabase
      .from('user_donations')
      .select('*')
      .eq('id', orderId)
      .single();

    if ((error || !donation)) {
      // Try by payment_id as a fallback
      const fallback = await supabase
        .from('user_donations')
        .select('*')
        .eq('payment_id', orderId)
        .single();
      donation = fallback.data as any;
      error = fallback.error as any;
    }

    if (error || !donation) {
      console.error('Error fetching donation:', error);
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // If we reached success page via return_url, assume success in sandbox
    // Optionally, you can check a query flag like cf_id in return_url and set completed
    if (donation.payment_status !== 'completed') {
      // Optimistic update for sandbox flow
      await supabase
        .from('user_donations')
        .update({ payment_status: 'completed' })
        .eq('id', donation.id);
      donation.payment_status = 'completed';
    }

    // Return payment verification response
    const verificationResponse = {
      order_id: orderId,
      order_amount: donation.amount,
      order_status: donation.payment_status === 'completed' ? 'PAID' : 'ACTIVE',
      payment_status: donation.payment_status === 'completed' ? 'SUCCESS' : 'PENDING',
      payment_method: donation.payment_gateway || 'Online Payment',
      payment_time: donation.updated_at,
      success: true
    };

    return NextResponse.json(verificationResponse);
  } catch (error) {
    console.error('Error in payment verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
