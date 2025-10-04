import { NextRequest, NextResponse } from 'next/server';
import { EmailSettingsService } from '@/services/email-settings';
import { emailService } from '@/services/email';
import { logger } from '@/lib/structured-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testEmail, testData } = body;

    // Test email configuration
    const configTest = await EmailSettingsService.testEmailConfiguration();
    
    if (!configTest.success) {
      return NextResponse.json({
        success: false,
        error: configTest.error,
        step: 'configuration',
      });
    }

    // Test email service connection
    const connectionTest = await emailService.testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: connectionTest.error,
        step: 'connection',
      });
    }

    // If test email is provided, send a test email
    if (testEmail && testData) {
      try {
        const { donorEmail, donorName, amount, donationId, receiptNumber } = testData;

        if (!donorEmail || !donorName || !amount || !donationId) {
          return NextResponse.json({
            success: false,
            error: 'Missing required test data fields',
            step: 'validation',
          });
        }

        // Generate test PDF
        const { serverPDFGenerator } = await import('@/services/pdf-generator');
        
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

        // Send test email
        const emailResult = await emailService.sendDonationReceipt(emailData, pdfBuffer);

        if (emailResult.success) {
          logger.info('Test email sent successfully', {
            testEmail,
            donationId,
            amount,
          });

          return NextResponse.json({
            success: true,
            message: 'Email configuration test successful and test email sent',
            testEmailSent: true,
          });
        } else {
          return NextResponse.json({
            success: false,
            error: emailResult.error,
            step: 'email_send',
          });
        }
      } catch (emailError) {
        logger.error('Failed to send test email', { error: emailError });
        return NextResponse.json({
          success: false,
          error: 'Failed to send test email',
          step: 'email_send',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email configuration test successful',
      testEmailSent: false,
    });
  } catch (error) {
    logger.error('Exception in email configuration test', { error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Test email configuration only
    const configTest = await EmailSettingsService.testEmailConfiguration();
    
    if (!configTest.success) {
      return NextResponse.json({
        success: false,
        error: configTest.error,
        step: 'configuration',
      });
    }

    // Test email service connection
    const connectionTest = await emailService.testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: connectionTest.error,
        step: 'connection',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email configuration test successful',
    });
  } catch (error) {
    logger.error('Exception in email configuration test', { error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
