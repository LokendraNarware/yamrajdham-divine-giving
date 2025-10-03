import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

// POST /api/payment/cleanup
// Marks pending donations older than 1 hour as failed
export async function POST() {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Update rows where payment_status is 'pending' and updated_at < oneHourAgo
    const result = await (supabase as any)
      .from('user_donations')
      .update({ payment_status: 'failed' })
      .lt('updated_at', oneHourAgo)
      .eq('payment_status', 'pending')
      .select('id, payment_status, updated_at');
    
    const { data, error } = result;

    if (error) {
      console.error('Cleanup error:', error);
      return NextResponse.json({ success: false, error: 'Cleanup failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, affected: data?.length || 0 });
  } catch (err) {
    console.error('Cleanup exception:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


