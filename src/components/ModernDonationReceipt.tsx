'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import QRCode from 'qrcode';

interface ModernDonationReceiptProps {
  donationId: string;
  donorName: string;
  amount: number;
  date: string;
  purpose?: string;
  paymentMethod?: string;
}

export default function ModernDonationReceipt({
  donationId,
  donorName,
  amount,
  date,
  purpose = "Temple Construction",
  paymentMethod = "Online Payment"
}: ModernDonationReceiptProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');

  useEffect(() => {
    // Generate QR code with donation verification link
    const generateQRCode = async () => {
      try {
        const verificationUrl = `${window.location.origin}/verify-donation?order_id=${donationId}`;
        const qrCodeData = await QRCode.toDataURL(verificationUrl, {
          width: 120, // Increased size for better clarity
          margin: 2, // Increased margin for better readability
          color: {
            dark: '#000000', // Black color
            light: '#FFFFFF' // White background
          },
          errorCorrectionLevel: 'M' // Medium error correction for better clarity
        });
        setQrCodeDataURL(qrCodeData);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [donationId]);
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
      month: 'short',
      day: 'numeric'
    });
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-[#F5F5DC] to-[#F0F0E6] p-6 rounded-2xl shadow-2xl border border-[#DAA520] border-opacity-20">
      {/* Header with Logo and Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#8B0000] shadow-lg">
            <Image
              src="/icon.png"
              alt="Dharam Dham Trust Logo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#8B0000]">DHARAM DHAM TRUST</h1>
            <p className="text-sm text-[#DAA520] font-medium">Yamraj - The Judge of Karma</p>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-[#8B0000] text-white px-3 py-1 rounded-full text-sm font-bold">
            DONATION RECEIPT
          </div>
        </div>
      </div>

      {/* Receipt Content */}
      <Card className="bg-white/90 backdrop-blur-sm border border-[#8B0000]/20 shadow-lg rounded-xl">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Receipt Number and Date */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-600 mr-2">Receipt No:</span>
                <span className="font-mono text-sm font-bold text-[#8B0000]">
                  {donationId || 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-600 mr-2">Date:</span>
                <span className="text-sm font-medium">
                  {formatDate(date)}
                </span>
              </div>
            </div>

            {/* Donor Information */}
            <div className="py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-600 mb-2">Donor Details</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-lg text-[#8B0000]">{donorName || 'Devotee'}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-600 mb-2">Donation Amount</p>
              <div className="bg-gradient-to-r from-[#DAA520]/10 to-[#8B0000]/10 p-4 rounded-lg">
                <p className="text-2xl font-bold text-[#8B0000]">
                  {formatAmount(amount)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  ({amount ? amount.toLocaleString('en-IN') : '0'} Rupees Only)
                </p>
              </div>
            </div>

            {/* Purpose and Payment Method */}
            <div className="grid grid-cols-2 gap-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Purpose</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">{purpose || 'Temple Construction'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Payment Method</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">{paymentMethod || 'Online Payment'}</p>
                </div>
              </div>
            </div>

            {/* Trust Information */}
            <div className="py-3 bg-gradient-to-r from-[#8B0000]/5 to-[#DAA520]/5 rounded-lg p-4">
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-semibold">Regd. No:</span> RAJ-202401341007870</p>
                <p><span className="font-semibold">PAN:</span> AAETD9289Q | 12AA & 80G approved</p>
                <p><span className="font-semibold">Address:</span> Yamraj Dham, Dhani Raju, Taranagar, Churu, Rajasthan</p>
                <p><span className="font-semibold">Contact:</span> +91 96625 44676 | dharamdhamtrust@gmail.com</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="flex justify-between items-end pt-4">
              <div className="text-center">
                <div className="border-b-2 border-dotted border-gray-400 w-32 h-8"></div>
                <p className="text-xs text-gray-500 mt-1">Authorized Signature</p>
              </div>
              <div className="text-center">
                {qrCodeDataURL ? (
                  <img 
                    src={qrCodeDataURL} 
                    alt="Donation Verification QR Code"
                    className="w-30 h-30 rounded-lg border-2 border-black bg-white"
                    style={{ width: '120px', height: '120px' }}
                  />
                ) : (
                  <div className="w-30 h-30 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center" style={{ width: '120px', height: '120px' }}>
                    <span className="text-sm text-gray-400">QR</span>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2 font-medium">Verify Donation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Thank you for your generous contribution to temple construction
        </p>
        <div className="flex justify-center space-x-4 mt-2">
          <span className="text-xs text-[#8B0000] font-semibold">🙏 धर्म धाम पावन नगरी ट्रस्ट 🙏</span>
        </div>
      </div>
    </div>
  );
}
