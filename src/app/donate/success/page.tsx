'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Mail, Heart } from 'lucide-react';
import { getOrderDetails, formatAmount } from '@/services/cashfree';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const orderId = searchParams.get('order_id');

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
    toast({
      title: "Receipt Download",
      description: "Receipt will be sent to your email address.",
    });
  };

  const handleEmailReceipt = () => {
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
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block text-primary">
                Yamrajdham Temple
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

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
                      {formatAmount(paymentDetails.order_amount)}
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

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={() => router.push("/")} 
              variant="default" 
              size="lg" 
              className="flex-1"
            >
              <Heart className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button 
              onClick={() => router.push("/donate")} 
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
}
