'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DonationReceiptProps {
  donationId: string;
  donorName: string;
  amount: number;
  date: string;
  purpose?: string;
  paymentMethod?: string;
}

export default function DonationReceipt({
  donationId,
  donorName,
  amount,
  date,
  purpose = "Temple Construction",
  paymentMethod = "Online Payment"
}: DonationReceiptProps) {
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
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8B0000] via-[#DAA520] to-[#8B0000]"></div>
      
      {/* Hindi banner at top */}
      <div className="text-center mb-6">
        <div className="inline-block bg-[#8B0000] text-[#DAA520] px-6 py-2 rounded-t-lg border-2 border-[#DAA520]">
          <span className="text-lg font-bold">धर्म धाम पावन नगरी ट्रस्ट</span>
        </div>
      </div>

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
      <Card className="bg-white border-2 border-[#8B0000] shadow-lg">
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
              <p className="text-black font-semibold">Amount (in words):</p>
              <div className="border-b-2 border-dotted border-black min-h-[40px] flex items-center">
                <span className="text-lg font-medium">
                  {formatAmount(amount)} ({amount ? amount.toLocaleString('en-IN') : '0'} Rupees Only)
                </span>
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <p className="text-black font-semibold">Purpose:</p>
              <div className="border-b-2 border-dotted border-black min-h-[40px] flex items-center">
                <span className="text-lg font-medium">{purpose || 'Temple Construction'}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <p className="text-black font-semibold">Payment Method:</p>
              <div className="border-b-2 border-dotted border-black min-h-[40px] flex items-center">
                <span className="text-lg font-medium">{paymentMethod || 'Online Payment'}</span>
              </div>
            </div>

            {/* Signature Section */}
            <div className="mt-8 flex justify-between">
              <div className="text-center">
                <div className="border-b-2 border-dotted border-black min-h-[40px] w-48"></div>
                <p className="text-sm text-black mt-2">Trustee Signature</p>
              </div>
              <div className="text-center">
                <div className="border-b-2 border-dotted border-black min-h-[40px] w-48"></div>
                <p className="text-sm text-black mt-2">Seal</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8B0000] via-[#DAA520] to-[#8B0000]"></div>
    </div>
  );
}
