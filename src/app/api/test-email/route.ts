import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/email';
import { serverPDFGenerator } from '@/services/pdf-generator';
import { logger } from '@/lib/structured-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donorEmail, donorName, amount, donationId, receiptNumber } = body;

    // Validate required fields
    if (!donorEmail || !donorName || !amount || !donationId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate test PDF
    const receiptData = {
      donationId: receiptNumber || donationId,
      donorName,
      amount: parseInt(amount),
      date: new Date().toISOString(),
      purpose: 'Temple Construction',
      paymentMethod: 'Online Payment',
      orderId: donationId,
    };

    const pdfBuffer = await serverPDFGenerator.generateReceiptPDF(receiptData);

    // Prepare email data
    const emailData = {
      donorName,
      donorEmail,
      amount: parseInt(amount),
      donationId,
      receiptNumber: receiptNumber || donationId,
      date: new Date().toISOString(),
      purpose: 'Temple Construction',
      paymentMethod: 'Online Payment',
      orderId: donationId,
    };

    // Send email
    const result = await emailService.sendDonationReceipt(emailData, pdfBuffer);

    if (result.success) {
      logger.info('Test donation receipt email sent successfully', {
        donorEmail,
        donationId,
        amount,
      });

      return NextResponse.json({
        success: true,
        message: 'Donation receipt email sent successfully',
        donorEmail,
        donationId,
      });
    } else {
      logger.error('Failed to send test donation receipt email', {
        donorEmail,
        donationId,
        error: result.error,
      });

      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Error in test email endpoint', { error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Test email service connection
    const connectionTest = await emailService.testConnection();

    if (connectionTest.success) {
      return NextResponse.json({
        success: true,
        message: 'Email service is configured and ready',
        emailConfigured: true,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email service is not properly configured',
        error: connectionTest.error,
        emailConfigured: false,
      });
    }
  } catch (error) {
    logger.error('Error testing email service', { error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
