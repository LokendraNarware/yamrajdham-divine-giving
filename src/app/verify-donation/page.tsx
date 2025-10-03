'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { verifyPayment } from '@/services/cashfree';

function VerifyDonationContent() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'verified' | 'invalid' | 'error'>('loading');
  const [donationDetails, setDonationDetails] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const verifyDonation = async () => {
      if (!orderId) {
        setVerificationStatus('invalid');
        setError('No donation ID provided');
        return;
      }

      try {
        const details = await verifyPayment(orderId);
        
        if (details && (details.order_status === 'PAID' || details.payment_status === 'SUCCESS')) {
          setVerificationStatus('verified');
          setDonationDetails(details);
        } else {
          setVerificationStatus('invalid');
          setError('Donation not found or payment not completed');
        }
      } catch (error) {
        console.error('Error verifying donation:', error);
        setVerificationStatus('error');
        setError('Failed to verify donation');
      }
    };

    verifyDonation();
  }, [orderId]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#8B0000]" />
            <h2 className="text-xl font-semibold mb-2">Verifying Donation...</h2>
            <p className="text-gray-600">Please wait while we verify your donation.</p>
          </div>
        );

      case 'verified':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Donation Verified!</h2>
            <p className="text-green-700 mb-6">
              Thank you for your generous contribution to Yamrajdham Temple.
            </p>
            
            {donationDetails && (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Donation Details</CardTitle>
                  <CardDescription>Your verified donation information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Order ID:</span>
                    <span className="font-mono text-sm">{donationDetails.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="font-bold text-[#8B0000]">
                      ₹{donationDetails.order_amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className="text-green-600 font-medium">Verified</span>
                  </div>
                  {donationDetails.payment_time && (
                    <div className="flex justify-between">
                      <span className="font-medium">Payment Date:</span>
                      <span>{new Date(donationDetails.payment_time).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Donation Not Found</h2>
            <p className="text-red-700 mb-6">
              {error || 'The donation ID provided is invalid or the payment was not completed.'}
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              Go to Home
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Verification Error</h2>
            <p className="text-red-700 mb-6">
              {error || 'An error occurred while verifying your donation. Please try again later.'}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#F5F5DC] to-[#F0F0E6] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#8B0000] mb-2">
              DHARAM DHAM TRUST
            </h1>
            <p className="text-[#DAA520] font-medium">
              Donation Verification
            </p>
          </div>

          {/* Verification Content */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {renderContent()}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              🙏 धर्म धाम पावन नगरी ट्रस्ट 🙏
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Yamraj Dham, Dhani Raju, Taranagar, Churu, Rajasthan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyDonationPage() {
  return (
    <Suspense fallback={
      <div className="bg-gradient-to-br from-[#F5F5DC] to-[#F0F0E6] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading verification...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyDonationContent />
    </Suspense>
  );
}
