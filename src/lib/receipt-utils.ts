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
    // Generate canvas from the receipt element
    const canvas = await html2canvas(receiptElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#F5F5DC',
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calculate dimensions to fit the receipt
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new page if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename
    const filename = `Donation_Receipt_${receiptData.donationId}_${new Date().getFullYear()}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate receipt PDF');
  }
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
