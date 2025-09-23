import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Mail, ArrowLeft, Heart } from "lucide-react";
import { getOrderDetails } from "@/services/cashfree";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const orderId = searchParams.get("order_id");
  const isDemo = searchParams.get("demo") === "true";

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (orderId) {
        try {
          // Add a small delay to ensure payment is processed
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const details = await getOrderDetails(orderId);
          setPaymentDetails(details);
          
          // Show success message if payment was successful
          if (details.order_status === 'PAID' || details.payment_status === 'SUCCESS') {
            toast({
              title: "Payment Successful!",
              description: "Thank you for your generous donation.",
            });
          } else if (details.order_status === 'ACTIVE' || details.payment_status === 'PENDING') {
            toast({
              title: "Payment Pending",
              description: "Your payment is being processed. Please wait.",
              variant: "default",
            });
          } else {
            toast({
              title: "Payment Status Unknown",
              description: "Please contact support for payment status.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching payment details:", error);
          toast({
            title: "Error",
            description: "Failed to fetch payment details. Please contact support.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [orderId, toast]);

  const handleDownloadReceipt = () => {
    // In a real implementation, you would generate and download a PDF receipt
    toast({
      title: "Receipt Download",
      description: "Receipt will be sent to your email address.",
    });
  };

  const handleEmailReceipt = () => {
    // In a real implementation, you would send receipt via email
    toast({
      title: "Receipt Sent",
      description: "Receipt has been sent to your email address.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50 mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-green-800 mb-2">
                  Payment Successful!
                </h1>
                <p className="text-green-700">
                  Thank you for your generous donation to Yamrajdham Temple.
                </p>
                {isDemo && (
                  <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Demo Mode:</strong> This is a simulated payment for testing purposes.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          {paymentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Your donation has been processed successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                    <p className="font-mono text-sm">{paymentDetails.order_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                    <p className="font-semibold text-lg text-primary">
                      ₹{paymentDetails.order_amount}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                    <p className={`font-medium ${
                      paymentDetails.order_status === 'PAID' || paymentDetails.payment_status === 'SUCCESS' 
                        ? 'text-green-600' 
                        : paymentDetails.order_status === 'ACTIVE' || paymentDetails.payment_status === 'PENDING'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {paymentDetails.order_status === 'PAID' ? 'PAID' : 
                       paymentDetails.payment_status || paymentDetails.order_status || 'UNKNOWN'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                    <p className="capitalize">
                      {paymentDetails.payment_method || 'Online Payment'}
                    </p>
                  </div>
                </div>
                
                {paymentDetails.payment_time && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Time</label>
                    <p>{new Date(paymentDetails.payment_time).toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Receipt Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Receipt & Tax Benefits</CardTitle>
              <CardDescription>
                Download your receipt for tax deduction purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Tax Benefits</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Eligible for 80G tax deduction under Income Tax Act</li>
                    <li>• Receipt valid for current financial year</li>
                    <li>• Keep this receipt for your tax filing</li>
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={handleDownloadReceipt} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button onClick={handleEmailReceipt} variant="outline" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Receipt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>
                Your contribution will help us build the temple
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Receipt Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Your official receipt will be processed and sent to your email within 24 hours.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Progress Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive regular updates about the temple construction progress.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Invitation to Inauguration</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll be invited to the temple inauguration ceremony.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={() => navigate("/")} 
              variant="divine" 
              size="lg" 
              className="flex-1"
            >
              <Heart className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button 
              onClick={() => navigate("/donate")} 
              variant="outline" 
              size="lg" 
              className="flex-1"
            >
              Make Another Donation
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
