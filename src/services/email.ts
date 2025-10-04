import nodemailer from 'nodemailer';
import { logger } from '@/lib/structured-logger';
import { config } from '@/lib/config';
import { EmailSettingsService, EmailSettingsConfig } from './email-settings';

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface DonationEmailData {
  donorName: string;
  donorEmail: string;
  amount: number;
  donationId: string;
  receiptNumber: string;
  date: string;
  purpose: string;
  paymentMethod: string;
  orderId?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private settingsConfig: EmailSettingsConfig | null = null;

  constructor() {
    // Don't initialize immediately - will be done when needed
  }

  private async initializeTransporter() {
    try {
      // Get email settings from database
      const settingsResult = await EmailSettingsService.getSettingsConfig();
      
      if (!settingsResult.success || !settingsResult.data) {
        logger.warn('Email service not configured - failed to load settings from database');
        return false;
      }

      this.settingsConfig = settingsResult.data;

      // Check if email service is enabled
      if (!this.settingsConfig.email_enabled) {
        logger.info('Email service is disabled in settings');
        return false;
      }

      // Check if in test mode
      if (this.settingsConfig.email_test_mode) {
        logger.info('Email service is in test mode - emails will not be sent');
        return false;
      }

      // Email configuration from database settings
      const emailConfig = {
        host: this.settingsConfig.smtp_host,
        port: this.settingsConfig.smtp_port,
        secure: this.settingsConfig.smtp_secure,
        auth: {
          user: this.settingsConfig.smtp_user,
          pass: this.settingsConfig.smtp_pass,
        },
      };

      // Validate required email configuration
      if (!emailConfig.auth.user || !emailConfig.auth.pass) {
        logger.warn('Email service not configured - SMTP credentials missing', {
          hasUser: !!emailConfig.auth.user,
          hasPass: !!emailConfig.auth.pass,
        });
        return false;
      }

      this.transporter = nodemailer.createTransporter(emailConfig);
      
      logger.info('Email service initialized from database settings', {
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        enabled: this.settingsConfig.email_enabled,
        testMode: this.settingsConfig.email_test_mode,
      });

      return true;
    } catch (error) {
      logger.error('Failed to initialize email service', { error });
      return false;
    }
  }

  async sendDonationReceipt(
    emailData: DonationEmailData,
    receiptPdf: Buffer
  ): Promise<{ success: boolean; error?: string }> {
    // Initialize transporter if not already done
    if (!this.transporter) {
      const initialized = await this.initializeTransporter();
      if (!initialized) {
        return { success: false, error: 'Email service not configured or disabled' };
      }
    }

    if (!this.transporter || !this.settingsConfig) {
      logger.warn('Email service not available - skipping email send');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const { donorName, donorEmail, amount, receiptNumber, date, purpose, paymentMethod } = emailData;

      // Format amount in Indian currency
      const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
      }).format(amount);

      // Format date
      const formattedDate = new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const mailOptions = {
        from: {
          name: this.settingsConfig.email_from_name,
          address: this.settingsConfig.email_from_address,
        },
        to: donorEmail,
        replyTo: this.settingsConfig.email_reply_to,
        subject: `Donation Receipt - ${receiptNumber} | Yamraj Dham Trust`,
        html: this.generateDonationEmailHTML(emailData, formattedAmount, formattedDate),
        text: this.generateDonationEmailText(emailData, formattedAmount, formattedDate),
        attachments: [
          {
            filename: `Donation_Receipt_${receiptNumber}.pdf`,
            content: receiptPdf,
            contentType: 'application/pdf',
          },
        ],
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      logger.info('Donation receipt email sent successfully', {
        messageId: result.messageId,
        donorEmail,
        receiptNumber,
        amount,
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to send donation receipt email', {
        error,
        donorEmail: emailData.donorEmail,
        receiptNumber: emailData.receiptNumber,
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private generateDonationEmailHTML(
    emailData: DonationEmailData,
    formattedAmount: string,
    formattedDate: string
  ): string {
    const { donorName, receiptNumber, purpose, paymentMethod, orderId } = emailData;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Receipt - Yamraj Dham Trust</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #d4af37;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #d4af37;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .receipt-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #d4af37;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
        }
        .detail-label {
            font-weight: bold;
            color: #555;
        }
        .detail-value {
            color: #333;
        }
        .amount-highlight {
            font-size: 20px;
            font-weight: bold;
            color: #27ae60;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .contact-info {
            margin-top: 15px;
        }
        .contact-info a {
            color: #d4af37;
            text-decoration: none;
        }
        .blessing {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            font-style: italic;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🕉️ Yamraj Dham Trust</div>
            <div class="subtitle">Yamraj - The Judge of Karma</div>
        </div>

        <div class="content">
            <div class="greeting">Dear ${donorName},</div>
            
            <p>Thank you for your generous donation to Yamraj Dham Trust. Your contribution helps us continue our mission of spiritual service and temple construction.</p>

            <div class="receipt-details">
                <div class="detail-row">
                    <span class="detail-label">Receipt Number:</span>
                    <span class="detail-value">${receiptNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Donation Amount:</span>
                    <span class="detail-value amount-highlight">${formattedAmount}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Purpose:</span>
                    <span class="detail-value">${purpose}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">${paymentMethod}</span>
                </div>
                ${orderId ? `
                <div class="detail-row">
                    <span class="detail-label">Transaction ID:</span>
                    <span class="detail-value">${orderId}</span>
                </div>
                ` : ''}
            </div>

            <div class="blessing">
                "May your generous contribution bring you peace, prosperity, and spiritual growth. Your donation is a sacred offering that will help preserve our spiritual heritage."
            </div>

            <p>Your donation receipt is attached to this email as a PDF document. Please keep this receipt for your records as it may be useful for tax purposes.</p>

            <p>If you have any questions about your donation or need assistance, please don't hesitate to contact us.</p>
        </div>

        <div class="footer">
            <div><strong>Yamraj Dham Trust</strong></div>
            <div>Regd. No: RAJ-202401341007870 | PAN: AAETD9289Q</div>
            <div>12AA & 80G approved</div>
            <div>Yamraj Dham, Dhani Raju, Taranagar, Churu, Rajasthan</div>
            <div class="contact-info">
                <div>📞 +91 96625 44676</div>
                <div>📧 <a href="mailto:dharamdhamtrust@gmail.com">dharamdhamtrust@gmail.com</a></div>
                <div>🌐 <a href="https://yamrajdham.com">yamrajdham.com</a></div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generateDonationEmailText(
    emailData: DonationEmailData,
    formattedAmount: string,
    formattedDate: string
  ): string {
    const { donorName, receiptNumber, purpose, paymentMethod, orderId } = emailData;

    return `
Yamraj Dham Trust - Donation Receipt

Dear ${donorName},

Thank you for your generous donation to Yamraj Dham Trust. Your contribution helps us continue our mission of spiritual service and temple construction.

DONATION DETAILS:
==================
Receipt Number: ${receiptNumber}
Donation Amount: ${formattedAmount}
Date: ${formattedDate}
Purpose: ${purpose}
Payment Method: ${paymentMethod}
${orderId ? `Transaction ID: ${orderId}` : ''}

BLESSING:
=========
"May your generous contribution bring you peace, prosperity, and spiritual growth. Your donation is a sacred offering that will help preserve our spiritual heritage."

Your donation receipt is attached to this email as a PDF document. Please keep this receipt for your records as it may be useful for tax purposes.

If you have any questions about your donation or need assistance, please don't hesitate to contact us.

CONTACT INFORMATION:
===================
Yamraj Dham Trust
Regd. No: RAJ-202401341007870 | PAN: AAETD9289Q
12AA & 80G approved
Yamraj Dham, Dhani Raju, Taranagar, Churu, Rajasthan

Phone: +91 96625 44676
Email: dharamdhamtrust@gmail.com
Website: https://yamrajdham.com

Thank you for your support!
Yamraj Dham Trust Team
    `;
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    // Initialize transporter if not already done
    if (!this.transporter) {
      const initialized = await this.initializeTransporter();
      if (!initialized) {
        return { success: false, error: 'Email service not configured or disabled' };
      }
    }

    if (!this.transporter) {
      return { success: false, error: 'Email service not configured' };
    }

    try {
      await this.transporter.verify();
      logger.info('Email service connection test successful');
      return { success: true };
    } catch (error) {
      logger.error('Email service connection test failed', { error });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const emailService = new EmailService();
