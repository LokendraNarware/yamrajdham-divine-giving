"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Smartphone, Building } from "lucide-react";
import { createPaymentSession, PaymentSessionData, generateCustomerId } from "@/services/cashfree";
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
      console.log('Initiating payment with data:', donationData);
      console.log('PaymentModal version:', '2024-01-25-v5-direct-link');
      
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
      
      const paymentUrl = response.data.payment_url;
      const sessionId = response.data.payment_session_id;
      
      console.log('Payment URL:', paymentUrl);
      console.log('Session ID:', sessionId);
      
      // Show success message
      toast({
        title: "Payment Session Created",
        description: "Redirecting to secure payment page...",
      });
      
      // Direct redirection to Cashfree payment page
      if (paymentUrl) {
        console.log('Redirecting to payment URL:', paymentUrl);
        console.log('Payment URL validation:', {
          isValid: paymentUrl.startsWith('http'),
          length: paymentUrl.length,
          containsSessionId: paymentUrl.includes(sessionId)
        });
        
        // Show success message
        toast({
          title: "Redirecting to Payment",
          description: "Opening secure payment page...",
        });
        
        // Small delay to show the toast message, then redirect
        setTimeout(() => {
          console.log('Executing redirect to:', paymentUrl);
          try {
            window.location.href = paymentUrl;
          } catch (redirectError) {
            console.error('Redirect error:', redirectError);
            // Fallback: try opening in new window
            window.open(paymentUrl, '_blank');
          }
        }, 1500);
      } else {
        throw new Error('Payment URL not received from Cashfree');
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
      description: "Visa, Mastercard, RuPay"
    },
    {
      name: "UPI",
      icon: <Smartphone className="w-5 h-5" />,
      description: "PhonePe, Google Pay, Paytm"
    },
    {
      name: "Net Banking",
      icon: <Building className="w-5 h-5" />,
      description: "All major banks"
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
                Choose your preferred payment method
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
                  Processing...
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
              Secure Payment • SSL Encrypted
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;