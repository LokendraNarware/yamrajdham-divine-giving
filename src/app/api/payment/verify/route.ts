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
    const { data: donation, error } = await supabase
      .from('donations')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !donation) {
      console.error('Error fetching donation:', error);
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Return payment verification response
    // In a real implementation, this would come from Cashfree API
    const verificationResponse = {
      order_id: orderId,
      order_amount: donation.amount,
      order_status: donation.status === 'completed' ? 'PAID' : 'ACTIVE',
      payment_status: donation.status === 'completed' ? 'SUCCESS' : 'PENDING',
      payment_method: donation.payment_method || 'Online Payment',
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
