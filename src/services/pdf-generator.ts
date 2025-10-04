import puppeteer from 'puppeteer';
import { logger } from '@/lib/structured-logger';

export interface ReceiptData {
  donationId: string;
  donorName: string;
  amount: number;
  date: string;
  purpose: string;
  paymentMethod: string;
  orderId?: string;
}

export class ServerPDFGenerator {
  private static instance: ServerPDFGenerator;
  private browser: puppeteer.Browser | null = null;

  private constructor() {}

  static getInstance(): ServerPDFGenerator {
    if (!ServerPDFGenerator.instance) {
      ServerPDFGenerator.instance = new ServerPDFGenerator();
    }
    return ServerPDFGenerator.instance;
  }

  private async getBrowser(): Promise<puppeteer.Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
      });
    }
    return this.browser;
  }

  async generateReceiptPDF(receiptData: ReceiptData): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      // Generate HTML for the receipt
      const html = this.generateReceiptHTML(receiptData);

      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
        },
        displayHeaderFooter: false,
      });

      logger.info('PDF generated successfully', {
        donationId: receiptData.donationId,
        donorName: receiptData.donorName,
        amount: receiptData.amount,
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      logger.error('Failed to generate PDF', {
        error,
        donationId: receiptData.donationId,
      });
      throw error;
    } finally {
      await page.close();
    }
  }

  private generateReceiptHTML(receiptData: ReceiptData): string {
    const { donationId, donorName, amount, date, purpose, paymentMethod, orderId } = receiptData;

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

    // Generate QR code data URL (we'll use a placeholder for now)
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yamrajdham.com'}/verify-donation?order_id=${orderId || donationId}`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Receipt - ${donationId}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            background-color: #F5F5DC;
            color: #333;
            line-height: 1.4;
        }
        
        .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #FFFFFF;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 15px;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%);
            padding: 30px;
            text-align: center;
            color: #2c3e50;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        
        .subtitle {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 15px;
        }
        
        .trust-info {
            font-size: 14px;
            opacity: 0.8;
            line-height: 1.3;
        }
        
        .receipt-title {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 1px;
        }
        
        .receipt-content {
            padding: 40px;
        }
        
        .receipt-details {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 30px;
            margin-bottom: 30px;
            border-left: 5px solid #d4af37;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-weight: bold;
            color: #495057;
            font-size: 16px;
        }
        
        .detail-value {
            color: #212529;
            font-size: 16px;
        }
        
        .amount-highlight {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .qr-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
        }
        
        .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 auto 15px;
            background-color: white;
            border: 2px solid #d4af37;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #666;
        }
        
        .qr-text {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
        }
        
        .blessing-section {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border: 2px solid #d4af37;
            border-radius: 15px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }
        
        .blessing-text {
            font-size: 18px;
            font-style: italic;
            color: #856404;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .blessing-author {
            font-size: 14px;
            color: #6c5ce7;
            font-weight: bold;
        }
        
        .footer {
            background-color: #2c3e50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .footer-details {
            font-size: 14px;
            line-height: 1.6;
            opacity: 0.9;
        }
        
        .contact-info {
            margin-top: 20px;
            font-size: 14px;
        }
        
        .contact-info div {
            margin: 5px 0;
        }
        
        .signature-section {
            margin-top: 40px;
            text-align: right;
        }
        
        .signature-line {
            border-bottom: 2px solid #333;
            width: 200px;
            margin: 0 auto 10px;
        }
        
        .signature-text {
            font-size: 14px;
            color: #666;
        }
        
        @media print {
            body {
                background-color: white;
            }
            .receipt-container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">🕉️ Yamraj Dham Trust</div>
            <div class="subtitle">Yamraj - The Judge of Karma</div>
            <div class="trust-info">
                Regd. No: RAJ-202401341007870 | PAN: AAETD9289Q<br>
                12AA & 80G approved
            </div>
        </div>
        
        <!-- Receipt Title -->
        <div class="receipt-title">
            DONATION RECEIPT
        </div>
        
        <!-- Receipt Content -->
        <div class="receipt-content">
            <!-- Receipt Details -->
            <div class="receipt-details">
                <div class="detail-row">
                    <span class="detail-label">Receipt Number:</span>
                    <span class="detail-value">${donationId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Received from:</span>
                    <span class="detail-value">${donorName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value amount-highlight">${formattedAmount}</span>
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
            
            <!-- QR Code Section -->
            <div class="qr-section">
                <div class="qr-code">
                    QR Code<br>
                    (Verification)
                </div>
                <div class="qr-text">
                    Scan to verify this receipt online
                </div>
            </div>
            
            <!-- Blessing Section -->
            <div class="blessing-section">
                <div class="blessing-text">
                    "May your generous contribution bring you peace, prosperity, and spiritual growth. Your donation is a sacred offering that will help preserve our spiritual heritage and continue the divine work of Yamraj Dham."
                </div>
                <div class="blessing-author">- Yamraj Dham Trust</div>
            </div>
            
            <!-- Signature Section -->
            <div class="signature-section">
                <div class="signature-line"></div>
                <div class="signature-text">Authorized Signature</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-title">Yamraj Dham Trust</div>
            <div class="footer-details">
                Yamraj Dham, Dhani Raju, Taranagar, Churu, Rajasthan<br>
                Dedicated to spiritual service and temple construction
            </div>
            <div class="contact-info">
                <div>📞 Phone: +91 96625 44676</div>
                <div>📧 Email: dharamdhamtrust@gmail.com</div>
                <div>🌐 Website: yamrajdham.com</div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const serverPDFGenerator = ServerPDFGenerator.getInstance();
