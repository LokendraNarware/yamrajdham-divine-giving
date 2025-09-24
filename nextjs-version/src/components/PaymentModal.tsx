"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Smartphone, Building } from "lucide-react";
import { createPaymentSession, PaymentSessionData, generateCustomerId, generateOrderId } from "@/services/cashfree";
import { CASHFREE_CONFIG } from "@/config/cashfree";
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

// Declare Cashfree SDK types
declare global {
  interface Window {
    Cashfree: new (config: { mode: string }) => {
      checkout: (options: { paymentSessionId: string; redirectTarget: string }) => Promise<void>;
    };
  }
}

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

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Generate a new unique order ID for each payment attempt
      const uniqueOrderId = generateOrderId('YAMRAJ');
      
      const sessionData: PaymentSessionData = {
        order_id: uniqueOrderId,
        order_amount: donationData.amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: generateCustomerId(donationData.donorEmail),
          customer_name: donationData.donorName,
          customer_email: donationData.donorEmail,
          customer_phone: formatPhoneForCashfree(donationData.donorPhone),
        },
        order_meta: {
          return_url: `${window.location.origin}/donate/success?order_id=${uniqueOrderId}`,
          notify_url: `${window.location.origin}/api/webhook/cashfree`,
        },
      };

      console.log('Initiating payment with data:', sessionData);
      console.log('Generated customer_id:', generateCustomerId(donationData.donorEmail));
      console.log('Original phone:', donationData.donorPhone);
      console.log('Formatted phone:', formatPhoneForCashfree(donationData.donorPhone));
      console.log('PaymentModal version:', '2024-01-25-v4-popup');
      
      // Show loading message
      toast({
        title: "Initializing Payment",
        description: "Setting up secure payment session...",
      });
      
      const response = await createPaymentSession(sessionData);
      
      console.log('Payment session response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create payment session');
      }
      
      const sessionId = response.data.payment_session_id;
      console.log('Session ID:', sessionId);
      console.log('CF Order ID:', response.data.cf_order_id);
      
      // Show success message before opening checkout
      toast({
        title: "Payment Session Created",
        description: "Opening Cashfree payment checkout...",
      });
      
      // Use Cashfree SDK checkout method as per Medium article
      await initiatePayment(sessionId);

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

  // Initialize Cashfree SDK as per Medium article
  const initializeSDK = async () => {
    return new Promise((resolve, reject) => {
      // Check if SDK is already loaded
      if (window.Cashfree) {
        console.log('Cashfree SDK already loaded');
        resolve(window.Cashfree);
        return;
      }

      // Load Cashfree SDK from the correct URL
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => {
        console.log('Cashfree SDK loaded successfully');
        console.log('Window.Cashfree:', window.Cashfree);
        console.log('Type of window.Cashfree:', typeof window.Cashfree);
        
        try {
          // window.Cashfree is a constructor function, so we need to instantiate it
          const cashfreeInstance = new window.Cashfree({
            mode: CASHFREE_CONFIG.ENVIRONMENT === 'production' ? 'PRODUCTION' : 'SANDBOX'
          });
          
          console.log('Cashfree instance created:', cashfreeInstance);
          console.log('Available methods on instance:', Object.keys(cashfreeInstance || {}));
          
          // Check if the instance has the checkout method
          if (cashfreeInstance && typeof cashfreeInstance.checkout === 'function') {
            console.log('Found checkout function on instance');
            resolve(cashfreeInstance);
          } else {
            reject(new Error('Cashfree instance created but checkout function not available. Available: ' + Object.keys(cashfreeInstance || {})));
          }
        } catch (error) {
          console.error('Error creating Cashfree instance:', error);
          reject(new Error('Failed to create Cashfree instance: ' + error.message));
        }
      };
      script.onerror = () => {
        console.error('Failed to load Cashfree SDK');
        reject(new Error('Failed to load Cashfree SDK'));
      };
      document.head.appendChild(script);
    });
  };

  // Initiate payment as per Medium article
  const initiatePayment = async (sessionId: string) => {
    try {
      const cashfree = await initializeSDK() as Window['Cashfree'];
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_self",  // Redirects to the target URL after payment
      };
      console.log("Starting checkout with options:", checkoutOptions);
      cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw error;
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
            Support the construction of Yamrajdham Temple
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

          {/* Security Badge */}
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-xs">
              🔒 Secure Payment • SSL Encrypted
            </Badge>
            {CASHFREE_CONFIG.DEMO_MODE && (
              <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                🧪 Demo Mode • Testing Only
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;