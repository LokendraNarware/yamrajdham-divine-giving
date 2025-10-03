import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch donation data with user information
    // First try by donation primary id (we use this as order_id in the flow)
    let { data: donation, error } = await supabase
      .from('user_donations')
      .select(`
        *,
        users (
          name,
          email,
          mobile,
          address,
          city,
          state,
          pin_code,
          pan_no
        )
      `)
      .eq('id', orderId)
      .single();

    if (error || !donation) {
      // Fallback by payment_id if available
      const fallback = await supabase
        .from('user_donations')
        .select(`
          *,
          users (
            name,
            email,
            mobile,
            address,
            city,
            state,
            pin_code,
            pan_no
          )
        `)
        .eq('payment_id', orderId)
        .single();
      donation = fallback.data as any;
      error = fallback.error as any;
    }

    if (error) {
      console.error('Error fetching donation:', error);
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Format the response
    const donationData = {
      id: (donation as any).id,
      amount: (donation as any).amount,
      donationType: (donation as any).donation_type,
      paymentStatus: (donation as any).payment_status,
      paymentId: (donation as any).payment_id,
      paymentGateway: (donation as any).payment_gateway,
      receiptNumber: (donation as any).receipt_number,
      isAnonymous: (donation as any).is_anonymous,
      dedicationMessage: (donation as any).dedication_message,
      preacherName: (donation as any).preacher_name,
      createdAt: (donation as any).created_at,
      updatedAt: (donation as any).updated_at,
      donor: (donation as any).users ? {
        name: (donation as any).users.name,
        email: (donation as any).users.email,
        mobile: (donation as any).users.mobile,
        address: (donation as any).users.address,
        city: (donation as any).users.city,
        state: (donation as any).users.state,
        pinCode: (donation as any).users.pin_code,
        panNo: (donation as any).users.pan_no
      } : null
    };

    return NextResponse.json(donationData);
  } catch (error) {
    console.error('Error in donation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
