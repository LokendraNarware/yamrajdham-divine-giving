import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donationId, status, paymentId } = body;
    
    if (!donationId || !status) {
      return NextResponse.json(
        { error: 'Donation ID and status are required' },
        { status: 400 }
      );
    }

    console.log('🔄 Updating donation status:', {
      donationId,
      status,
      paymentId
    });

    // Update donation status in database
    const { data: updatedDonation, error } = await supabase
      .from('user_donations')
      .update({
        payment_status: status,
        payment_id: paymentId || null,
        payment_gateway: 'cashfree',
        updated_at: new Date().toISOString()
      })
      .eq('id', donationId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating donation status:', error);
      return NextResponse.json(
        { error: 'Failed to update donation status' },
        { status: 500 }
      );
    }

    console.log('✅ Donation status updated successfully:', updatedDonation);

    return NextResponse.json({
      success: true,
      message: 'Donation status updated successfully',
      data: updatedDonation
    });

  } catch (error) {
    console.error('❌ Error in update-status:', error);
    
    return NextResponse.json(
      { error: `Failed to update donation status: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
