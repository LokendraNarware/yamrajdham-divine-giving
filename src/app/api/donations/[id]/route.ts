import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch donation data with user information
    const { data: donation, error } = await supabase
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
      id: donation.id,
      amount: donation.amount,
      donationType: donation.donation_type,
      paymentStatus: donation.status,
      paymentId: donation.payment_id,
      paymentGateway: donation.payment_method,
      receiptNumber: donation.receipt_number,
      isAnonymous: donation.is_anonymous,
      dedicationMessage: donation.message,
      preacherName: donation.donors?.preacher_name,
      createdAt: donation.created_at,
      updatedAt: donation.updated_at,
      donor: donation.donors ? {
        name: donation.donors.name,
        email: donation.donors.email,
        mobile: donation.donors.mobile,
        address: donation.donors.address,
        city: donation.donors.city,
        state: donation.donors.state,
        pinCode: donation.donors.pin_code,
        panNo: donation.donors.pan_no
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
