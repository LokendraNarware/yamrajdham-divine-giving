import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { supabase } from '@/integrations/supabase/client';

type DbStatus = 'pending' | 'completed' | 'failed' | 'refunded';

function eventToDbStatus(eventType: string): DbStatus | null {
  switch (eventType) {
    case 'PAYMENT_SUCCESS':
      return 'completed';
    case 'PAYMENT_FAILED':
    case 'PAYMENT_USER_DROPPED':
    case 'PAYMENT_CANCELLED':
      return 'failed';
    case 'PAYMENT_REFUND_SUCCESS':
    case 'REFUND_SUCCESS':
      return 'refunded';
    default:
      return null;
  }
}

function verifySignature(rawBody: string, headerSignature: string | null, secret: string | undefined): boolean {
  if (!secret || !headerSignature) return false;
  // Cashfree 2025-01-01 uses Base64-encoded HMAC-SHA256 of the RAW body
  const hmac = createHmac('sha256', secret).update(rawBody, 'utf8');
  const computedBase64 = hmac.digest('base64');

  // Some integrations may expect hex — compute both to be tolerant
  const computedHex = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');

  const provided = headerSignature.trim();
  try {
    const a = Buffer.from(computedBase64);
    const b = Buffer.from(provided);
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  } catch {}
  try {
    const a = Buffer.from(computedHex);
    const b = Buffer.from(provided);
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  } catch {}
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.CASHFREE_WEBHOOK_SECRET;
    const allowInsecure = (process.env.CASHFREE_WEBHOOK_ALLOW_INSECURE || '').toLowerCase() === 'true';
    const signature = request.headers.get('x-webhook-signature') || request.headers.get('x-cf-signature');
    const raw = await request.text();

    if (!allowInsecure && !verifySignature(raw, signature, secret)) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(raw);
    const eventType: string = payload?.event || payload?.type || '';
    const orderId: string | undefined = payload?.data?.order?.order_id || payload?.data?.order_id || payload?.order_id;
    const paymentId: string | undefined = payload?.data?.payment?.payment_id || payload?.data?.payment_id;

    if (!eventType || !orderId) {
      return NextResponse.json({ success: false, error: 'Missing event or order_id' }, { status: 400 });
    }

    const mapped = eventToDbStatus(eventType);
    if (!mapped) {
      // Ignore unrelated events
      return NextResponse.json({ success: true, ignored: true });
    }

    // Find donation row by id (primary order id) or fallback to payment_id
    let { data: donation } = await supabase
      .from('user_donations')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!donation) {
      const fb = await supabase
        .from('user_donations')
        .select('*')
        .eq('payment_id', orderId)
        .single();
      donation = fb.data as any;
    }

    if (!donation) {
      // If we can’t find it, nothing to update, acknowledge to avoid retries loop
      return NextResponse.json({ success: true, not_found: true });
    }

    const updateData: Record<string, any> = { payment_status: mapped };
    if (paymentId && !(donation as any).payment_id) {
      updateData.payment_id = paymentId;
    }

    await (supabase.from('user_donations') as any)
      .update(updateData)
      .eq('id', (donation as any).id);

    // Cache invalidation removed - not available in webhook context

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cashfree webhook error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// Handle preflight/test pings cleanly
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-webhook-signature, x-cf-signature',
    },
  });
}

// Handle GET requests for webhook testing/verification
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Cashfree webhook endpoint is active',
    timestamp: new Date().toISOString(),
    methods: ['POST', 'GET', 'OPTIONS'],
    version: '2025-01-01'
  });
}

// Handle HEAD requests for webhook testing
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Webhook-Status': 'active',
      'X-Webhook-Version': '2025-01-01'
    }
  });
}


