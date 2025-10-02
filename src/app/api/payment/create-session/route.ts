import { NextRequest, NextResponse } from 'next/server';
import { CFPaymentGateway, CFEnvironment, CFOrderRequest, CFConfig, CFOrderResponse, CFCustomerDetails, CFOrderMeta } from 'cashfree-pg-sdk-nodejs';
import { z } from 'zod';

// Environment configuration
const CASHFREE_CONFIG = {
  APP_ID: process.env.CASHFREE_APP_ID!,
  SECRET_KEY: process.env.CASHFREE_SECRET_KEY!,
  ENVIRONMENT: process.env.CASHFREE_ENVIRONMENT || 'sandbox',
  WEBHOOK_SECRET: process.env.CASHFREE_WEBHOOK_SECRET!,
};

// Validation schemas
const CustomerDetailsSchema = z.object({
  customer_id: z.string().min(1, 'Customer ID is required'),
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z.string().email('Valid email is required'),
  customer_phone: z.string().min(10, 'Valid phone number is required'),
});

const OrderMetaSchema = z.object({
  return_url: z.string().url('Valid return URL is required'),
  notify_url: z.string().url('Valid notify URL is required').optional(),
  payment_methods: z.string().optional(),
});

const PaymentSessionDataSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
  order_amount: z.number().positive('Order amount must be positive'),
  order_currency: z.string().default('INR'),
  customer_details: CustomerDetailsSchema,
  order_meta: OrderMetaSchema,
  order_note: z.string().optional(),
});

// Initialize Cashfree SDK
const cashfree = new CFPaymentGateway();

// Cashfree configuration
const cfConfig = new CFConfig(
  CASHFREE_CONFIG.ENVIRONMENT === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  '2023-08-01',
  CASHFREE_CONFIG.APP_ID,
  CASHFREE_CONFIG.SECRET_KEY,
  30000, // 30 seconds timeout
  null // webProxy
);

export async function POST(request: NextRequest) {
  try {
    console.log('Creating payment session for hosted checkout...');
    
    // Check if Cashfree credentials are configured
    if (!CASHFREE_CONFIG.APP_ID || !CASHFREE_CONFIG.SECRET_KEY || 
        CASHFREE_CONFIG.APP_ID === 'your_app_id_here' || 
        CASHFREE_CONFIG.SECRET_KEY === 'your_secret_key_here') {
      console.log('Cashfree credentials not configured, returning mock response');
      console.log('Config check:', {
        hasAppId: !!CASHFREE_CONFIG.APP_ID,
        hasSecretKey: !!CASHFREE_CONFIG.SECRET_KEY,
        appIdValue: CASHFREE_CONFIG.APP_ID,
        secretKeyValue: CASHFREE_CONFIG.SECRET_KEY?.substring(0, 10) + '...'
      });
      
      // Parse and validate request body
      const body = await request.json();
      console.log('Mock request body:', body);
      const validatedData = PaymentSessionDataSchema.parse(body);
      console.log('Mock validated data:', validatedData);
      
      const mockResponse = {
        success: true,
        data: {
          order_id: validatedData.order_id,
          payment_session_id: `mock_session_${Date.now()}`,
          payment_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/donate/success?order_id=${validatedData.order_id}`,
          order_amount: validatedData.order_amount,
          order_currency: validatedData.order_currency,
          customer_details: validatedData.customer_details,
        },
        message: 'Mock payment session created (credentials not configured)'
      };
      
      console.log('Mock response:', mockResponse);
      return NextResponse.json(mockResponse);
    }
    
    // Parse and validate request body
    const body = await request.json();
    console.log('Request body:', body);
    
    const validatedData = PaymentSessionDataSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Prepare customer details
    const customerDetails = new CFCustomerDetails();
    customerDetails.customerId = validatedData.customer_details.customer_id;
    customerDetails.customerName = validatedData.customer_details.customer_name;
    customerDetails.customerEmail = validatedData.customer_details.customer_email;
    customerDetails.customerPhone = validatedData.customer_details.customer_phone;

    // Prepare order meta
    const orderMeta = new CFOrderMeta();
    orderMeta.returnUrl = validatedData.order_meta.return_url;
    orderMeta.notifyUrl = validatedData.order_meta.notify_url || `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/cashfree`;
    orderMeta.paymentMethods = validatedData.order_meta.payment_methods || 'cc,dc,upi,nb,app';

    // Prepare order data for Cashfree
    const orderData = new CFOrderRequest();
    orderData.orderId = validatedData.order_id;
    orderData.orderAmount = validatedData.order_amount;
    orderData.orderCurrency = validatedData.order_currency;
    orderData.customerDetails = customerDetails;
    orderData.orderMeta = orderMeta;
    orderData.orderNote = validatedData.order_note || `Donation for Yamrajdham Temple - Order ${validatedData.order_id}`;

    console.log('Order data for Cashfree:', orderData);

    // Create order using Cashfree SDK
    const orderResponse: CFOrderResponse = await cashfree.orderCreate(cfConfig, orderData);
    
    console.log('Cashfree order response:', orderResponse);

    if (!orderResponse) {
      throw new Error('Invalid response from Cashfree');
    }

    const order = orderResponse.cfOrder;
    if (!order) {
      throw new Error('Order data not received from Cashfree');
    }

    const { orderId, paymentSessionId, paymentLink } = order;

    if (!paymentSessionId) {
      throw new Error('Payment session ID not received from Cashfree');
    }

    console.log('Session ID from Cashfree:', paymentSessionId);
    console.log('Session ID length:', paymentSessionId.length);
    console.log('Payment Link from Cashfree:', paymentLink);

    // Return success response with cleaned payment session ID
    return NextResponse.json({
      success: true,
      data: {
        order_id: orderId,
        payment_session_id: paymentSessionId,
        payment_url: paymentLink,
        order_amount: validatedData.order_amount,
        order_currency: validatedData.order_currency,
        customer_details: validatedData.customer_details,
      },
      message: 'Payment session created successfully'
    });

  } catch (error) {
    console.error('Error creating payment session:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation Error',
        details: error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    // Handle Cashfree API errors
    if (error && typeof error === 'object' && 'response' in error) {
      const cashfreeError = error as any;
      console.error('Cashfree API Error Details:', {
        status: cashfreeError.response?.status,
        statusText: cashfreeError.response?.statusText,
        body: cashfreeError.body,
        headers: cashfreeError.response?.headers
      });
      return NextResponse.json({
        success: false,
        error: 'Cashfree API Error',
        message: cashfreeError.response?.data?.message || cashfreeError.message || 'Payment session creation failed',
        details: {
          status: cashfreeError.response?.status,
          body: cashfreeError.body,
          message: cashfreeError.message
        }
      }, { status: cashfreeError.response?.status || 500 });
    }

    // Handle other errors
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method Not Allowed',
    message: 'GET method not supported for this endpoint'
  }, { status: 405 });
}
