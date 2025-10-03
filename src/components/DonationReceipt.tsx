'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DonationReceiptProps {
  donationId: string; // This will be the receipt_number from DB
  donorName: string;
  amount: number;
  date: string;
  purpose?: string;
  paymentMethod?: string;
  orderId?: string; // Optional order_id for QR code verification
}

export default function DonationReceipt({
  donationId,
  donorName,
  amount,
  date,
  purpose = "Temple Construction",
  paymentMethod = "Online Payment",
  orderId
}: DonationReceiptProps) {
  console.log('DonationReceipt rendered with new design');
  const formatAmount = (amount: number) => {
    if (!amount || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#F5F5DC] p-8 relative">
      {/* Hindi banner at top */}
      <div className="text-center mb-6">
        <div className="inline-block bg-[#8B0000] text-[#DAA520] px-6 py-2 rounded-t-lg border-2 border-[#DAA520]">
          <span className="text-lg font-bold">धर्म धाम पावन नगरी ट्रस्ट</span>
        </div>
      </div>

      {/* Decorative top border */}
      <div className="h-2 bg-gradient-to-r from-[#8B0000] via-[#DAA520] to-[#8B0000] mb-6"></div>

      {/* Header with logos and title */}
      <div className="text-center mb-8">
        {/* Logos */}
        <div className="flex justify-center items-center mb-4">
          <div className="w-20 h-20 bg-[#8B0000] rounded-full border-4 border-[#DAA520] flex items-center justify-center mx-4">
            <div className="text-[#DAA520] text-2xl">🙏</div>
          </div>
          <div className="w-20 h-20 bg-[#8B0000] rounded-full border-4 border-[#DAA520] flex items-center justify-center mx-4">
            <div className="text-[#DAA520] text-2xl">🙏</div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl font-bold text-[#DAA520] mb-2 tracking-wide">
          DHARAM DHAM TRUST
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-[#DAA520] mb-4 font-medium">
          YAMRAJ - THE JUDGE OF KARMA, THE GUARDIAN OF DHARMA
        </p>

        {/* Trust Details */}
        <div className="text-sm text-black space-y-1">
          <p className="font-semibold">Regd. No.- RAJ-202401341007870 | 12AA & 80G approved | PAN No.: AAETD9289Q</p>
          <p>Temple Trust NGO Regd. by Government of India Trust Act, 1882</p>
          <p>Yamraj Dham, Dhani Raju, Ta. Taranagar, Dist. Churu, Rajasthan-331023</p>
          <p>Mobile: +91 96625 44676, +91 84273 83381</p>
          <p>Website: https://dharamdhamtrust.org | Email ID: dharamdhamtrust@gmail.com</p>
        </div>
      </div>

      {/* Donation Receipt Button */}
      <div className="text-center mb-8">
        <div className="inline-block bg-[#DAA520] text-black px-8 py-3 rounded-full border-2 border-[#8B0000] font-bold text-lg">
          DONATION RECEIPT
        </div>
      </div>

      {/* Receipt Content */}
      <Card className="bg-white border-2 border-[#8B0000] shadow-lg mb-6">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Receipt Number and Date */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-black font-semibold mr-2">No.:</span>
                <span className="border-b-2 border-dotted border-black min-w-[200px] text-center">
                  {donationId || 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-black font-semibold mr-2">Date:</span>
                <span className="border-b-2 border-dotted border-black min-w-[200px] text-center">
                  {formatDate(date)}
                </span>
              </div>
            </div>

            {/* Donor Name */}
            <div className="space-y-2">
              <p className="text-black font-semibold">Received with Thanks from Smt/Sri</p>
              <div className="border-b-2 border-dotted border-black min-h-[40px] flex items-center">
                <span className="text-lg font-medium">{donorName || 'Devotee'}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <p className="text-black font-semibold">the sum of Rupees</p>
              <div className="border-b-2 border-dotted border-black min-h-[40px] flex items-center">
                <span className="text-lg font-medium">
                  {formatAmount(amount)} ({amount ? amount.toLocaleString('en-IN') : '0'} Rupees Only)
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <p className="text-black font-semibold">Only by Cash/Cheque/UPI/DD No.</p>
              <div className="border-b-2 border-dotted border-black min-h-[40px] flex items-center">
                <span className="text-lg font-medium">{paymentMethod || 'Online Payment'}</span>
              </div>
            </div>

            {/* Date fields */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-black font-semibold mr-2">Dated</span>
                <span className="border-b-2 border-dotted border-black min-w-[150px] text-center">
                  {formatDate(date)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-black font-semibold mr-2">on</span>
                <span className="border-b-2 border-dotted border-black min-w-[150px] text-center">
                  {formatDate(date)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section with Bank Details, QR Code, and Signature */}
      <div className="flex justify-between items-end">
        {/* Bank Details */}
        <div className="w-1/3">
          <div className="flex items-center mb-4">
            <span className="text-black font-semibold mr-2">₹</span>
            <div className="border-2 border-black w-32 h-8 bg-white"></div>
            <span className="text-black font-semibold ml-2">For Dharam Dham Trust.</span>
          </div>
          <div className="text-sm text-black space-y-1">
            <p><span className="font-semibold">NAME:</span> DHARAM DHAM TRUST</p>
            <p><span className="font-semibold">ACCOUNT NO:</span> 50200106804890</p>
            <p><span className="font-semibold">IFSC CODE:</span> HDFC0002795</p>
            <p><span className="font-semibold">BRANCH:</span> RAJGARH, RAJASTHAN</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="w-1/3 flex justify-center">
          <div className="w-32 h-32 bg-white border-2 border-black flex items-center justify-center">
            <div className="text-xs text-gray-500 text-center">
              QR CODE<br/>PLACEHOLDER
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="w-1/3 text-center">
          <div className="border-b-2 border-dotted border-black min-h-[40px] w-48 mx-auto"></div>
          <p className="text-sm text-black mt-2">Authorized Signature</p>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-2 bg-gradient-to-r from-[#8B0000] via-[#DAA520] to-[#8B0000] mt-8"></div>
    </div>
  );
}
