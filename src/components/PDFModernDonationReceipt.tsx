'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import QRCode from 'qrcode';

interface PDFModernDonationReceiptProps {
  donationId: string;
  donorName: string;
  amount: number;
  date: string;
  purpose?: string;
  paymentMethod?: string;
}

export default function PDFModernDonationReceipt({
  donationId,
  donorName,
  amount,
  date,
  purpose = "Temple Construction",
  paymentMethod = "Online Payment"
}: PDFModernDonationReceiptProps) {
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
    <div style={{
      width: '100%',
      maxWidth: '900px', // Increased to give more space
      margin: '0 auto',
      backgroundColor: '#F5F5DC',
      padding: '32px', // Increased padding for better spacing
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid #DAA520',
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      minHeight: '800px',
      boxSizing: 'border-box'
    }}>
      {/* Header with Logo and Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'nowrap', // Prevent wrapping to maintain alignment
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px' // Increased gap for better spacing
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #8B0000',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <Image
              src="/icon.png"
              alt="Dharam Dham Trust Logo"
              width={64}
              height={64}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#8B0000',
              margin: '0',
              lineHeight: '1.2'
            }}>DHARAM DHAM TRUST</h1>
            <p style={{
              fontSize: '12px',
              color: '#DAA520',
              fontWeight: '500',
              margin: '0',
              lineHeight: '1.2'
            }}>Yamraj - The Judge of Karma</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            backgroundColor: '#8B0000',
            color: '#FFFFFF', // Changed to white color
            padding: '8px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            DONATION RECEIPT
          </div>
        </div>
      </div>

      {/* Receipt Content */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #8B0000',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        padding: '28px' // Increased padding for better spacing
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}> {/* Increased gap */}
          {/* Receipt Number and Date */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #E5E7EB',
            flexWrap: 'nowrap', // Prevent wrapping for better alignment
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6B7280',
                marginRight: '8px'
              }}>Receipt No:</span>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#8B0000'
              }}>
                {donationId || 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6B7280',
                marginRight: '8px'
              }}>Date:</span>
              <span style={{
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {formatDate(date)}
              </span>
            </div>
          </div>

          {/* Donor Information */}
          <div style={{
            padding: '16px 0',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <p style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6B7280',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>Donor Details</p>
            <div style={{
              backgroundColor: '#F9FAFB',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <p style={{
                fontWeight: '500',
                fontSize: '16px',
                color: '#8B0000',
                margin: '0'
              }}>{donorName || 'Devotee'}</p>
            </div>
          </div>

          {/* Amount */}
          <div style={{
            padding: '16px 0',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <p style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6B7280',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>Donation Amount</p>
            <div style={{
              background: 'linear-gradient(90deg, rgba(218, 165, 32, 0.1) 0%, rgba(139, 0, 0, 0.1) 100%)',
              padding: '16px',
              borderRadius: '8px'
            }}>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#8B0000',
                margin: '0 0 4px 0'
              }}>
                {formatAmount(amount)}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#6B7280',
                margin: '0'
              }}>
                ({amount ? amount.toLocaleString('en-IN') : '0'} Rupees Only)
              </p>
            </div>
          </div>

          {/* Purpose and Payment Method */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr', // Fixed two-column layout
            gap: '24px', // Increased gap for better separation
            padding: '16px 0'
          }}>
            <div>
              <p style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6B7280',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>Purpose</p>
              <div style={{
                backgroundColor: '#F9FAFB',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  margin: '0'
                }}>{purpose || 'Temple Construction'}</p>
              </div>
            </div>
            <div>
              <p style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6B7280',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>Payment Method</p>
              <div style={{
                backgroundColor: '#F9FAFB',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  margin: '0'
                }}>{paymentMethod || 'Online Payment'}</p>
              </div>
            </div>
          </div>

          {/* Trust Information */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(139, 0, 0, 0.05) 0%, rgba(218, 165, 32, 0.05) 100%)',
            borderRadius: '8px',
            padding: '20px', // Increased padding for better alignment
            marginTop: '8px'
          }}>
            <div style={{
              fontSize: '10px',
              color: '#6B7280',
              lineHeight: '1.4'
            }}>
              <p style={{ margin: '0 0 4px 0' }}>
                <span style={{ fontWeight: '600' }}>Regd. No:</span> RAJ-202401341007870
              </p>
              <p style={{ margin: '0 0 4px 0' }}>
                <span style={{ fontWeight: '600' }}>PAN:</span> AAETD9289Q | 12AA & 80G approved
              </p>
              <p style={{ margin: '0 0 4px 0' }}>
                <span style={{ fontWeight: '600' }}>Address:</span> Yamraj Dham, Dhani Raju, Taranagar, Churu, Rajasthan
              </p>
              <p style={{ margin: '0' }}>
                <span style={{ fontWeight: '600' }}>Contact:</span> +91 96625 44676 | dharamdhamtrust@gmail.com
              </p>
            </div>
          </div>

          {/* Signature Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            paddingTop: '20px', // Increased padding
            marginTop: '8px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                borderBottom: '2px dotted #9CA3AF',
                width: '128px',
                height: '32px'
              }}></div>
              <p style={{
                fontSize: '10px',
                color: '#6B7280',
                margin: '4px 0 0 0'
              }}>Authorized Signature</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              {qrCodeDataURL ? (
                <img 
                  src={qrCodeDataURL} 
                  alt="Donation Verification QR Code"
                  style={{
                    width: '120px', // Increased size to match generation
                    height: '120px',
                    borderRadius: '8px',
                    border: '2px solid #000000', // Black border to match QR code
                    backgroundColor: '#FFFFFF' // Ensure white background
                  }}
                />
              ) : (
                <div style={{
                  width: '120px', // Match the QR code size
                  height: '120px',
                  backgroundColor: '#F3F4F6',
                  border: '2px dashed #D1D5DB',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#9CA3AF'
                  }}>QR</span>
                </div>
              )}
              <p style={{
                fontSize: '12px', // Slightly larger text
                color: '#6B7280',
                margin: '8px 0 0 0', // Increased margin
                fontWeight: '500'
              }}>Verify Donation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <p style={{
          fontSize: '10px',
          color: '#6B7280',
          margin: '0'
        }}>
          Thank you for your generous contribution to temple construction
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '8px'
        }}>
          <span style={{
            fontSize: '10px',
            color: '#8B0000',
            fontWeight: '600'
          }}>🙏 धर्म धाम पावन नगरी ट्रस्ट 🙏</span>
        </div>
      </div>
    </div>
  );
}
