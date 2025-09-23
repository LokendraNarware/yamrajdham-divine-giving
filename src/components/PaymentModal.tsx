import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Smartphone, Building, CheckCircle, XCircle } from "lucide-react";
import { createPaymentSession, PaymentSessionData, getOrderDetails } from "@/services/cashfree";
import { CASHFREE_CONFIG } from "@/config/cashfree";
import { useToast } from "@/hooks/use-toast";

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
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentFailure: (error: string) => void;
}

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  donationData, 
  onPaymentSuccess, 
  onPaymentFailure 
}: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const sessionData: PaymentSessionData = {
        order_id: donationData.orderId,
        order_amount: donationData.amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: donationData.donorEmail,
          customer_name: donationData.donorName,
          customer_email: donationData.donorEmail,
          customer_phone: donationData.donorPhone,
        },
        order_meta: {
          return_url: `${window.location.origin}/donate/success?order_id=${donationData.orderId}`,
          notify_url: `${window.location.origin}/api/webhook/cashfree`,
        },
      };

      console.log('Initiating payment with data:', sessionData);
      
      // Show loading message
      toast({
        title: "Initializing Payment",
        description: "Setting up secure payment session...",
      });
      
      const response = await createPaymentSession(sessionData);
      setPaymentUrl(response.payment_url);
      
      // Show success message before redirect
      toast({
        title: "Redirecting to Payment",
        description: "You will be redirected to Cashfree payment page.",
      });
      
      // Small delay to show the message, then redirect
      setTimeout(() => {
        window.location.href = response.payment_url;
      }, 1000);

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
            Secure payment powered by Cashfree
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

          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Payment Successful!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Your donation has been processed successfully.
                </p>
              </CardContent>
            </Card>
          )}

          {paymentStatus === 'failed' && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Payment Failed</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Please try again or contact support.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {paymentStatus === 'pending' && (
              <Button 
                onClick={handlePayment} 
                disabled={isLoading}
                variant="divine" 
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
            )}

            <Button 
              onClick={onClose} 
              variant="outline" 
              size="lg" 
              className="w-full"
            >
              {paymentStatus === 'success' ? 'Close' : 'Cancel'}
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
