import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReceiptData {
  donationId: string;
  donorName: string;
  amount: number;
  date: string;
  purpose?: string;
  paymentMethod?: string;
}

export const generateReceiptPDF = async (
  receiptElement: HTMLElement,
  receiptData: ReceiptData
): Promise<void> => {
  try {
    console.log('Starting PDF generation...');
    console.log('Receipt element:', receiptElement);
    
    if (!receiptElement) {
      throw new Error('Receipt element not found');
    }

    // Wait a bit for any images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate canvas from the receipt element
    const canvas = await html2canvas(receiptElement, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#F5F5DC',
      logging: false,
      width: receiptElement.scrollWidth,
      height: receiptElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: false,
      ignoreElements: (element) => {
        // Skip elements that might cause issues
        return element.tagName === 'SCRIPT' || element.tagName === 'STYLE' || element.tagName === 'LINK';
      }
    });

    console.log('Canvas generated:', canvas.width, 'x', canvas.height);

    // Create PDF
    const imgData = canvas.toDataURL('image/png', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;
    
    // Use the full A4 page (no margins for better fit)
    const imgWidth = a4Width;
    const imgHeight = a4Height;
    
    console.log('A4 dimensions:', a4Width, 'x', a4Height);
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
    console.log('PDF image dimensions:', imgWidth, 'x', imgHeight);

    // Add image to PDF covering the full page
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Generate filename
    const filename = `Donation_Receipt_${receiptData.donationId}_${new Date().getFullYear()}.pdf`;
    
    console.log('Saving PDF:', filename);
    
    // Save the PDF
    pdf.save(filename);
    
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF with html2canvas:', error);
    
    // Fallback: Generate a simple text-based PDF
    try {
      console.log('Attempting fallback PDF generation...');
      await generateSimplePDF(receiptData);
    } catch (fallbackError) {
      console.error('Fallback PDF generation also failed:', fallbackError);
      throw new Error(`Failed to generate receipt PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

export const generateSimplePDF = async (receiptData: ReceiptData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Set font
  pdf.setFont('helvetica', 'bold');
  
  // Header
  pdf.setFontSize(20);
  pdf.text('DHARAM DHAM TRUST', 105, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text('Yamraj - The Judge of Karma', 105, 30, { align: 'center' });
  
  // Receipt title
  pdf.setFontSize(16);
  pdf.text('DONATION RECEIPT', 105, 45, { align: 'center' });
  
  // Receipt details
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  let yPosition = 60;
  
  // Receipt number and date
  pdf.text(`Receipt No: ${receiptData.donationId}`, 20, yPosition);
  pdf.text(`Date: ${new Date(receiptData.date).toLocaleDateString('en-IN')}`, 120, yPosition);
  yPosition += 15;
  
  // Donor name
  pdf.text(`Received from: ${receiptData.donorName}`, 20, yPosition);
  yPosition += 15;
  
  // Amount
  pdf.text(`Amount: ₹${receiptData.amount.toLocaleString('en-IN')}`, 20, yPosition);
  yPosition += 15;
  
  // Purpose
  pdf.text(`Purpose: ${receiptData.purpose}`, 20, yPosition);
  yPosition += 15;
  
  // Payment method
  pdf.text(`Payment Method: ${receiptData.paymentMethod}`, 20, yPosition);
  yPosition += 20;
  
  // Trust details
  pdf.setFontSize(10);
  pdf.text('Regd. No: RAJ-202401341007870 | PAN: AAETD9289Q', 20, yPosition);
  yPosition += 8;
  pdf.text('12AA & 80G approved', 20, yPosition);
  yPosition += 8;
  pdf.text('Yamraj Dham, Dhani Raju, Taranagar, Churu, Rajasthan', 20, yPosition);
  yPosition += 8;
  pdf.text('Contact: +91 96625 44676 | dharamdhamtrust@gmail.com', 20, yPosition);
  yPosition += 15;
  
  // Signature
  pdf.text('Authorized Signature', 20, yPosition);
  pdf.line(20, yPosition + 5, 60, yPosition + 5);
  
  // Generate filename and save
  const filename = `Donation_Receipt_${receiptData.donationId}_${new Date().getFullYear()}.pdf`;
  pdf.save(filename);
  
  console.log('Simple PDF generated successfully');
};

export const formatAmountInWords = (amount: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  const convertHundreds = (num: number): string => {
    let result = '';
    
    if (num > 99) {
      result += ones[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    
    if (num > 19) {
      result += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    } else if (num > 9) {
      result += teens[num - 10] + ' ';
      return result.trim();
    }
    
    if (num > 0) {
      result += ones[num] + ' ';
    }
    
    return result.trim();
  };
  
  const convertThousands = (num: number): string => {
    if (num === 0) return 'Zero';
    
    let result = '';
    
    if (num >= 10000000) {
      result += convertHundreds(Math.floor(num / 10000000)) + ' Crore ';
      num %= 10000000;
    }
    
    if (num >= 100000) {
      result += convertHundreds(Math.floor(num / 100000)) + ' Lakh ';
      num %= 100000;
    }
    
    if (num >= 1000) {
      result += convertHundreds(Math.floor(num / 1000)) + ' Thousand ';
      num %= 1000;
    }
    
    if (num > 0) {
      result += convertHundreds(num);
    }
    
    return result.trim() + ' Rupees Only';
  };
  
  return convertThousands(amount);
};
