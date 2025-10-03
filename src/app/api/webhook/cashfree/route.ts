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
  if (!secret || !headerSignature) {
    console.log('Signature verification skipped:', { hasSecret: !!secret, hasSignature: !!headerSignature });
    return false;
  }

  console.log('Verifying webhook signature:', {
    hasSecret: !!secret,
    hasSignature: !!headerSignature,
    signaturePreview: headerSignature.substring(0, 20) + '...',
    bodyLength: rawBody.length
  });

  // Cashfree 2025-01-01 uses Base64-encoded HMAC-SHA256 of the RAW body
  const hmac = createHmac('sha256', secret).update(rawBody, 'utf8');
  const computedBase64 = hmac.digest('base64');

  // Some integrations may expect hex — compute both to be tolerant
  const computedHex = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');

  const provided = headerSignature.trim();
  
  console.log('Signature comparison:', {
    computedBase64Preview: computedBase64.substring(0, 20) + '...',
    computedHexPreview: computedHex.substring(0, 20) + '...',
    providedPreview: provided.substring(0, 20) + '...'
  });

  try {
    const a = Buffer.from(computedBase64);
    const b = Buffer.from(provided);
    if (a.length === b.length && timingSafeEqual(a, b)) {
      console.log('Signature verification successful (Base64)');
      return true;
    }
  } catch (error) {
    console.log('Base64 signature verification failed:', error);
  }
  
  try {
    const a = Buffer.from(computedHex);
    const b = Buffer.from(provided);
    if (a.length === b.length && timingSafeEqual(a, b)) {
      console.log('Signature verification successful (Hex)');
      return true;
    }
  } catch (error) {
    console.log('Hex signature verification failed:', error);
  }
  
  console.log('Signature verification failed - no match found');
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
      method: request.method,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Enhanced test request detection for Cashfree webhook testing
    const isTestRequest = (
      !raw || 
      raw.trim() === '' || 
      raw === '{}' ||
      raw.includes('"type":"test"') ||
      raw.includes('"event":"test"') ||
      raw.includes('"test":true') ||
      raw.includes('test_webhook') ||
      raw.includes('webhook_test') ||
      raw.includes('cashfree_test') ||
      userAgent?.includes('test') ||
      userAgent?.includes('Cashfree') ||
      !signature || // No signature usually means test request
      !secret || // No webhook secret configured
      raw.length < 50 || // Very short payloads are likely tests
      contentType === 'application/json' && raw.length === 0 // Empty JSON body
    );

    if (isTestRequest) {
      console.log('Test webhook request received (bypassing signature verification)', {
        hasSignature: !!signature,
        userAgent,
        bodyLength: raw.length,
        bodyPreview: raw.substring(0, 100),
        contentType,
        webhookVersion
      });
      
      // Return proper response for Cashfree webhook test
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook endpoint is active and ready',
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '2025-01-01',
        test: true,
        endpoint: 'https://yamrajdham.com/api/webhook/cashfree'
      }, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Status': 'active',
          'X-Webhook-Version': '2025-01-01'
        }
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
    
    // First, try to find by cashfree_order_id
    let { data: donation, error: lookupError } = await supabase
      .from('user_donations')
      .select('*')
      .eq('cashfree_order_id', orderId)
      .single();

    console.log('Primary lookup result:', { 
      found: !!donation, 
      error: lookupError?.message,
      donationId: (donation as any)?.id,
      cashfreeOrderId: (donation as any)?.cashfree_order_id
    });

    // If not found by cashfree_order_id, try payment_id fallback
    if (!donation && lookupError?.code === 'PGRST116') { // No rows found
      console.log('Not found by cashfree_order_id, trying payment_id fallback...');
      const fb = await supabase
        .from('user_donations')
        .select('*')
        .eq('payment_id', orderId)
        .single();
      
      console.log('Payment ID fallback result:', { 
        found: !!fb.data, 
        error: fb.error?.message,
        donationId: (fb.data as any)?.id,
        paymentId: (fb.data as any)?.payment_id
      });
      
      donation = fb.data as any;
      lookupError = fb.error;
    }

    // If still not found, try id fallback (for backward compatibility)
    if (!donation && lookupError?.code === 'PGRST116') {
      console.log('Not found by payment_id, trying id fallback...');
      const fb2 = await supabase
        .from('user_donations')
        .select('*')
        .eq('id', orderId)
        .single();
      
      console.log('ID fallback result:', { 
        found: !!fb2.data, 
        error: fb2.error?.message,
        donationId: (fb2.data as any)?.id
      });
      
      donation = fb2.data as any;
      lookupError = fb2.error;
    }

    // Handle database errors
    if (lookupError && lookupError.code !== 'PGRST116') {
      console.error('Database lookup error:', {
        error: lookupError,
        orderId,
        eventType,
        paymentId
      });
      return NextResponse.json({ 
        success: false, 
        error: 'Database lookup failed',
        details: {
          error_message: lookupError.message,
          error_code: lookupError.code,
          order_id: orderId
        }
      }, { status: 500 });
    }

    // Handle case where donation is not found
    if (!donation) {
      console.log('Donation not found for order ID:', orderId);
      console.log('Available fields in payload:', {
        orderId,
        paymentId,
        eventType,
        payloadKeys: Object.keys(payload?.data || {})
      });
      
      // Return success to prevent retries, but log for debugging
      return NextResponse.json({ 
        success: true, 
        not_found: true, 
        order_id: orderId,
        message: 'Donation not found - may need to check database schema or order ID mapping'
      });
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
export async function OPTIONS(request: NextRequest) {
  console.log('OPTIONS request received for webhook endpoint:', {
    timestamp: new Date().toISOString(),
    url: request.url,
    headers: Object.fromEntries(request.headers.entries())
  });

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-webhook-signature, x-webhook-version, x-webhook-timestamp, x-idempotency-key, Authorization',
      'Access-Control-Max-Age': '86400',
      'X-Webhook-Status': 'active',
      'X-Webhook-Version': '2025-01-01'
    },
  });
}

// Handle GET requests for webhook testing/verification
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const test = url.searchParams.get('test');
  
  console.log('GET request received for webhook endpoint:', {
    timestamp: new Date().toISOString(),
    url: request.url,
    test,
    userAgent: request.headers.get('user-agent')
  });
  
  if (test === 'webhook' || test === 'cashfree') {
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Cashfree webhook endpoint is active and ready',
      timestamp: new Date().toISOString(),
      methods: ['POST', 'GET', 'HEAD', 'OPTIONS'],
      version: '2025-01-01',
      environment: process.env.CASHFREE_ENVIRONMENT || 'unknown',
      hasSecret: !!process.env.CASHFREE_WEBHOOK_SECRET,
      allowInsecure: (process.env.CASHFREE_WEBHOOK_ALLOW_INSECURE || '').toLowerCase() === 'true',
      endpoint: 'https://yamrajdham.com/api/webhook/cashfree',
      test: true
    }, {
      headers: {
        'X-Webhook-Status': 'active',
        'X-Webhook-Version': '2025-01-01'
      }
    });
  }
  
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Cashfree webhook endpoint is active',
    timestamp: new Date().toISOString(),
    methods: ['POST', 'GET', 'HEAD', 'OPTIONS'],
    version: '2025-01-01',
    endpoint: 'https://yamrajdham.com/api/webhook/cashfree'
  }, {
    headers: {
      'X-Webhook-Status': 'active',
      'X-Webhook-Version': '2025-01-01'
    }
  });
}

// Handle HEAD requests for webhook testing
export async function HEAD(request: NextRequest) {
  console.log('HEAD request received for webhook endpoint:', {
    timestamp: new Date().toISOString(),
    url: request.url,
    userAgent: request.headers.get('user-agent')
  });

  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Webhook-Status': 'active',
      'X-Webhook-Version': '2025-01-01',
      'X-Webhook-Endpoint': 'https://yamrajdham.com/api/webhook/cashfree'
    }
  });
}


