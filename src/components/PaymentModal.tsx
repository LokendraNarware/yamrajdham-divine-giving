"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Smartphone, Building } from "lucide-react";
import { createPaymentSession, PaymentSessionData, generateCustomerId } from "@/services/cashfree";
import { initializeCashfree, openCashfreeCheckout, getCashfreeConfig, waitForCashfree } from "@/lib/cashfree-client";
import { useToast } from "@/hooks/use-toast";

// Format phone number for Cashfree API
const formatPhoneForCashfree = (phone: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it starts with +91, keep it as is
  if (cleaned.startsWith('+91')) {
    return cleaned;
  }
  
  // If it starts with 91, add +
  if (cleaned.startsWith('91')) {
    return '+' + cleaned;
  }
  
  // If it's a 10-digit number, add +91
  if (cleaned.length === 10) {
    return '+91' + cleaned;
  }
  
  // Return as is if it doesn't match expected patterns
  return cleaned;
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationData: {
    amount: number;
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    orderId: string;
  };
  onPaymentSuccess: (paymentData: { payment_id?: string; order_id?: string }) => void;
  onPaymentFailure: (error: string) => void;
}

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  donationData, 
  onPaymentSuccess, // eslint-disable-line @typescript-eslint/no-unused-vars
  onPaymentFailure 
}: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Debug logging
  console.log('PaymentModal rendered with props:', {
    isOpen,
    donationData,
    hasOnClose: !!onClose,
    hasOnPaymentSuccess: !!onPaymentSuccess,
    hasOnPaymentFailure: !!onPaymentFailure
  });

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      console.log('Initiating hosted checkout payment with data:', donationData);
      console.log('PaymentModal version:', '2024-01-25-v6-hosted-checkout');
      
      // Show loading message
      toast({
        title: "Creating Payment Session",
        description: "Setting up secure payment...",
      });
      
      const sessionData: PaymentSessionData = {
        order_id: donationData.orderId,
        order_amount: donationData.amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: generateCustomerId(donationData.donorEmail),
          customer_name: donationData.donorName,
          customer_email: donationData.donorEmail,
          customer_phone: formatPhoneForCashfree(donationData.donorPhone),
        },
        order_meta: {
          return_url: `${window.location.origin}/donate/success?order_id=${donationData.orderId}`,
          notify_url: `${window.location.origin}/api/webhook/cashfree`,
        },
      };

      console.log('Session data prepared:', sessionData);
      
      // Create payment session
      const response = await createPaymentSession(sessionData);
      
      console.log('Payment session response:', response);
      console.log('Response validation:', {
        success: response.success,
        hasData: !!response.data,
        hasPaymentUrl: !!response.data?.payment_url,
        hasSessionId: !!response.data?.payment_session_id
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create payment session');
      }
      
      if (!response.data) {
        throw new Error('No payment data received from server');
      }
      
      const paymentSessionId = response.data.payment_session_id;
      
      if (!paymentSessionId) {
        throw new Error('Payment session ID not received from Cashfree');
      }
      
      console.log('Payment Session ID:', paymentSessionId);
      
      // Wait for Cashfree SDK to load
      toast({
        title: "Loading Payment Gateway",
        description: "Initializing secure checkout...",
      });
      
      const sdkReady = await waitForCashfree(5000);
      if (!sdkReady) {
        console.error('Cashfree SDK not available, falling back to direct redirect');
        // Fallback: direct redirect to payment URL
        if (response.data?.payment_url) {
          window.location.href = response.data.payment_url;
          onClose();
          return;
        } else {
          throw new Error('Payment gateway failed to load. Please refresh the page and try again.');
        }
      }
      
      // Initialize Cashfree SDK
      const config = getCashfreeConfig();
      const cashfree = initializeCashfree(config);
      
      if (!cashfree) {
        console.error('Failed to initialize Cashfree SDK, falling back to direct redirect');
        // Fallback: direct redirect to payment URL
        if (response.data?.payment_url) {
          window.location.href = response.data.payment_url;
          onClose();
          return;
        } else {
          throw new Error('Failed to initialize payment gateway');
        }
      }
      
      // Show success message
      toast({
        title: "Opening Payment Gateway",
        description: "Redirecting to secure payment page...",
      });
      
      // Open hosted checkout
      try {
        await openCashfreeCheckout(cashfree, {
          paymentSessionId,
          redirectTarget: '_self' // Opens in same tab
        });
        
        console.log('Hosted checkout opened successfully');
        
        // Close the modal since we're redirecting
        onClose();
        
      } catch (checkoutError) {
        console.error('Checkout error:', checkoutError);
        console.log('Falling back to direct redirect');
        // Fallback: direct redirect to payment URL
        if (response.data?.payment_url) {
          window.location.href = response.data.payment_url;
          onClose();
        } else {
          throw new Error('Failed to open payment gateway. Please try again.');
        }
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment';
      onPaymentFailure(errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };


  const paymentMethods = [
    {
      name: "Credit/Debit Cards",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Visa, Mastercard, RuPay, Amex"
    },
    {
      name: "UPI",
      icon: <Smartphone className="w-5 h-5" />,
      description: "PhonePe, Google Pay, Paytm, BHIM"
    },
    {
      name: "Net Banking",
      icon: <Building className="w-5 h-5" />,
      description: "All major banks"
    },
    {
      name: "Wallets",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Paytm, PhonePe, Mobikwik"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Complete Your Donation</DialogTitle>
          <DialogDescription className="text-center">
            Support the construction of Yamraj dham Temple
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Donation Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Donation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Donor Name:</span>
                <span className="font-medium">{donationData.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium">{donationData.donorEmail}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-medium">{donationData.donorPhone}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Amount:</span>
                <span className="text-primary">₹{donationData.amount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Methods</CardTitle>
              <CardDescription>
                Secure payment gateway with 120+ payment options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    {method.icon}
                    <div className="flex-1">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handlePayment} 
              disabled={isLoading}
              variant="default" 
              size="lg" 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Opening Payment Gateway...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay ₹{donationData.amount}
                </>
              )}
            </Button>

            <Button 
              onClick={onClose} 
              variant="outline" 
              size="lg" 
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          {/* Debug Info (Development Only) */}
          {typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
              <div className="font-semibold mb-2">Debug Info:</div>
              <div>Order ID: {donationData.orderId}</div>
              <div>Amount: ₹{donationData.amount}</div>
              <div>Environment: {process.env.NODE_ENV}</div>
              <div>Origin: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</div>
            </div>
          )}

          {/* Security Badge */}
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-xs">
              Secure Payment • PCI Compliant • 120+ Payment Methods
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;