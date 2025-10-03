import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { supabase } from '@/integrations/supabase/client';

type DbStatus = 'pending' | 'completed' | 'failed' | 'refunded';

function eventToDbStatus(eventType: string): DbStatus | null {
  switch (eventType) {
    case 'PAYMENT_SUCCESS_WEBHOOK':
      return 'completed';
    case 'PAYMENT_FAILED_WEBHOOK':
    case 'PAYMENT_USER_DROPPED_WEBHOOK':
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
    const signature = request.headers.get('x-webhook-signature');
    const webhookVersion = request.headers.get('x-webhook-version');
    const contentType = request.headers.get('content-type');
    const userAgent = request.headers.get('user-agent');
    const raw = await request.text();

    console.log('Webhook received:', {
      timestamp: new Date().toISOString(),
      signature: signature ? 'present' : 'missing',
      webhookVersion,
      contentType,
      userAgent,
      allowInsecure,
      bodyLength: raw.length,
      url: request.url,
      method: request.method
    });

    // Check if this is a test request (bypass signature verification)
    const isTestRequest = (
      !raw || 
      raw.trim() === '' || 
      raw === '{}' ||
      raw.includes('"type":"test"') ||
      raw.includes('"event":"test"') ||
      raw.includes('test_webhook') ||
      raw.includes('webhook_test') ||
      userAgent?.includes('test') ||
      !signature || // No signature usually means test request
      !secret || // No webhook secret configured
      raw.length < 50 // Very short payloads are likely tests
    );

    if (isTestRequest) {
      console.log('Test webhook request received (bypassing signature verification)', {
        hasSignature: !!signature,
        userAgent,
        bodyLength: raw.length,
        bodyPreview: raw.substring(0, 100)
      });
      return NextResponse.json({ 
        success: true, 
        message: 'Test webhook received successfully',
        timestamp: new Date().toISOString(),
        version: '2025-01-01',
        test: true
      });
    }

    if (!allowInsecure && !verifySignature(raw, signature, secret)) {
      console.error('Webhook signature verification failed', {
        hasSignature: !!signature,
        hasSecret: !!secret,
        allowInsecure,
        signaturePreview: signature?.substring(0, 20) + '...',
        bodyPreview: raw.substring(0, 200)
      });
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (parseError) {
      console.error('Failed to parse webhook payload:', parseError);
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }
    const eventType: string = payload?.type || payload?.event || '';
    const orderId: string | undefined = payload?.data?.order?.order_id || payload?.data?.order_id || payload?.order_id;
    const paymentId: string | undefined = payload?.data?.payment?.cf_payment_id || payload?.data?.payment?.payment_id || payload?.data?.payment_id;

    console.log('Webhook payload:', {
      eventType,
      orderId,
      paymentId,
      payload: JSON.stringify(payload, null, 2)
    });

    if (!eventType || !orderId) {
      console.error('Missing required fields:', { eventType, orderId });
      return NextResponse.json({ success: false, error: 'Missing event or order_id' }, { status: 400 });
    }

    const mapped = eventToDbStatus(eventType);
    if (!mapped) {
      // Ignore unrelated events
      return NextResponse.json({ success: true, ignored: true });
    }

    // Find donation row by cashfree_order_id (primary lookup) or fallback to payment_id
    console.log('Looking up donation with order ID:', orderId);
    
    let { data: donation, error: lookupError } = await supabase
      .from('user_donations')
      .select('*')
      .eq('cashfree_order_id', orderId)
      .single();

    if (!donation && !lookupError) {
      console.log('Not found by cashfree_order_id, trying payment_id fallback...');
      const fb = await supabase
        .from('user_donations')
        .select('*')
        .eq('payment_id', orderId)
        .single();
      donation = fb.data as any;
      lookupError = fb.error;
    }

    if (!donation && !lookupError) {
      console.log('Not found by payment_id, trying id fallback...');
      const fb2 = await supabase
        .from('user_donations')
        .select('*')
        .eq('id', orderId)
        .single();
      donation = fb2.data as any;
      lookupError = fb2.error;
    }

    if (lookupError) {
      console.error('Database lookup error:', lookupError);
      return NextResponse.json({ success: false, error: 'Database lookup failed' }, { status: 500 });
    }

    if (!donation) {
      console.log('Donation not found for order ID:', orderId);
      // If we can't find it, nothing to update, acknowledge to avoid retries loop
      return NextResponse.json({ success: true, not_found: true, order_id: orderId });
    }

    console.log('Found donation:', {
      id: (donation as any).id,
      amount: (donation as any).amount,
      current_status: (donation as any).payment_status,
      cashfree_order_id: (donation as any).cashfree_order_id,
      payment_id: (donation as any).payment_id
    });

    const updateData: Record<string, any> = { 
      payment_status: mapped,
      last_verified_at: new Date().toISOString()
    };
    if (paymentId && !(donation as any).payment_id) {
      updateData.payment_id = paymentId;
    }

    console.log('Updating donation with data:', {
      donation_id: (donation as any).id,
      update_data: updateData,
      event_type: eventType,
      mapped_status: mapped,
      payment_id: paymentId
    });

    const { error: updateError } = await (supabase.from('user_donations') as any)
      .update(updateData)
      .eq('id', (donation as any).id);

    if (updateError) {
      console.error('Error updating donation status:', {
        donation_id: (donation as any).id,
        update_data: updateData,
        error: updateError,
        event_type: eventType,
        order_id: orderId
      });
      return NextResponse.json({ 
        success: false, 
        error: 'Database update failed',
        details: {
          donation_id: (donation as any).id,
          update_data: updateData,
          error_message: updateError.message
        }
      }, { status: 500 });
    }

    console.log(`Successfully updated donation ${(donation as any).id} status to ${mapped}`, {
      donation_id: (donation as any).id,
      old_status: (donation as any).payment_status,
      new_status: mapped,
      event_type: eventType,
      order_id: orderId,
      payment_id: paymentId
    });

    // Cache invalidation removed - not available in webhook context

    return NextResponse.json({ 
      success: true,
      donation_id: (donation as any).id,
      old_status: (donation as any).payment_status,
      new_status: mapped,
      event_type: eventType
    });
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
      'Access-Control-Allow-Headers': 'Content-Type, x-webhook-signature, x-webhook-version, x-webhook-timestamp, x-idempotency-key',
    },
  });
}

// Handle GET requests for webhook testing/verification
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const test = url.searchParams.get('test');
  
  if (test === 'webhook') {
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Cashfree webhook endpoint is active and ready',
      timestamp: new Date().toISOString(),
      methods: ['POST', 'GET', 'HEAD', 'OPTIONS'],
      version: '2025-01-01',
      environment: process.env.CASHFREE_ENVIRONMENT || 'unknown',
      hasSecret: !!process.env.CASHFREE_WEBHOOK_SECRET,
      allowInsecure: (process.env.CASHFREE_WEBHOOK_ALLOW_INSECURE || '').toLowerCase() === 'true'
    });
  }
  
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Cashfree webhook endpoint is active',
    timestamp: new Date().toISOString(),
    methods: ['POST', 'GET', 'HEAD', 'OPTIONS'],
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


