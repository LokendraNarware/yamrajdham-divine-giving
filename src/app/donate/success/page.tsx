"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Mail, Heart } from "lucide-react";
import { verifyPayment } from "@/services/cashfree";
import { useToast } from "@/hooks/use-toast";
import DonationReceipt from "@/components/DonationReceipt";
import ModernDonationReceipt from "@/components/ModernDonationReceipt";
import PDFModernDonationReceipt from "@/components/PDFModernDonationReceipt";
import { generateReceiptPDF } from "@/lib/receipt-utils";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  // Stable date fallback to prevent hydration issues
  const stableDateFallback = '2025-01-01T00:00:00.000Z';
  
  // Add a client-side only flag to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [paymentDetails, setPaymentDetails] = useState<{
    order_id: string;
    order_amount: number;
    order_status: string;
    payment_status?: string;
    payment_method?: string;
    payment_time?: string;
  } | null>(null);
  const [donationData, setDonationData] = useState<{
    id: string;
    amount: number;
    donationType: string;
    paymentStatus: string;
    paymentId: string;
    paymentGateway: string;
    receiptNumber: string;
    isAnonymous: boolean;
    dedicationMessage: string;
    preacherName: string;
    createdAt: string;
    updatedAt: string;
    donor: {
      name: string;
      email: string;
      mobile: string;
      address: string;
      city: string;
      state: string;
      pinCode: string;
      panNo: string;
    } | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [receiptType, setReceiptType] = useState<'traditional' | 'modern'>('modern');
  const [receiptRef, setReceiptRef] = useState<HTMLDivElement | null>(null);
  
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (orderId) {
        try {
          // Add a small delay to ensure payment is processed
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const details = await verifyPayment(orderId);
          setPaymentDetails(details);
          
          // Fetch donation data from database
          try {
            const donationResponse = await fetch(`/api/donations/${orderId}`);
            if (donationResponse.ok) {
              const donation = await donationResponse.json();
              setDonationData(donation);
            } else {
              console.error('Failed to fetch donation data');
            }
          } catch (error) {
            console.error('Error fetching donation data:', error);
          }
          
          // Update donation status in database if payment was successful
          if (details && (details.order_status === 'PAID' || details.payment_status === 'SUCCESS')) {
            toast({
              title: "Donation Successful!",
              description: "Thank you for your generous donation.",
            });
          } else if (details && (details.order_status === 'ACTIVE' || details.payment_status === 'PENDING')) {
            toast({
              title: "Payment Pending",
              description: "Your payment is being processed. Please wait.",
              variant: "default",
            });
          } else if (details) {
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

  const handleDownloadReceipt = async () => {
    if (!paymentDetails || !donationData || !isClient) {
      toast({
        title: "Error",
        description: "Receipt data not available",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting modern receipt download...');
      console.log('Payment details:', paymentDetails);
      console.log('Donation data:', donationData);

      // Create a temporary container for the modern receipt
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '900px'; // Increased width for PDF generation
      tempContainer.style.height = 'auto'; // Auto height to fit content
      tempContainer.style.backgroundColor = '#F5F5DC';
      tempContainer.style.padding = '32px'; // Match the component padding
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.boxSizing = 'border-box';
      document.body.appendChild(tempContainer);

      // Render the modern receipt in the temporary container
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempContainer);
      
      const ModernReceiptElement = (
        <PDFModernDonationReceipt
          donationId={paymentDetails.order_id || 'N/A'}
          donorName={donationData.donor?.name || "Devotee"}
          amount={paymentDetails.order_amount || 0}
          date={paymentDetails.payment_time || donationData.createdAt || stableDateFallback}
          purpose={donationData.donationType === 'general' ? 'Temple Construction' : donationData.donationType || 'Temple Construction'}
          paymentMethod={paymentDetails.payment_method || "Online Payment"}
        />
      );

      root.render(ModernReceiptElement);

      // Wait for the component to render and images to load
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate PDF from the temporary container
      await generateReceiptPDF(tempContainer, {
        donationId: paymentDetails.order_id || 'N/A',
        donorName: donationData.donor?.name || "Devotee",
        amount: paymentDetails.order_amount || 0,
        date: paymentDetails.payment_time || donationData.createdAt || stableDateFallback,
        purpose: donationData.donationType === 'general' ? 'Temple Construction' : donationData.donationType || 'Temple Construction',
        paymentMethod: paymentDetails.payment_method || "Online Payment"
      });

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

      toast({
        title: "Modern Donation Receipt Downloaded",
        description: "Your modern donation receipt has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading modern receipt:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to download modern receipt: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleEmailReceipt = () => {
    // In a real implementation, you would send receipt via email
    toast({
      title: "Donation Receipt Sent",
      description: "Donation receipt has been sent to your email address.",
    });
  };

  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isLoading ? "Loading payment details..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50 mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-green-800 mb-2">
                  Donation Successful!
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
                    <label className="text-sm font-medium text-muted-foreground">Donation ID</label>
                    <p className="font-mono text-sm">{paymentDetails.order_id || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                    <p className="font-semibold text-lg text-primary">
                      ₹{paymentDetails.order_amount || 0}
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
                    <p>
                      {isClient 
                        ? new Date(paymentDetails.payment_time).toLocaleString('en-IN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Kolkata'
                          })
                        : paymentDetails.payment_time
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Donation Receipt */}
          {paymentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Donation Receipt</CardTitle>
                    <CardDescription>
                      Download your donation receipt for your records
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={receiptType === 'modern' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setReceiptType('modern')}
                    >
                      Modern
                    </Button>
                    <Button
                      variant={receiptType === 'traditional' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setReceiptType('traditional')}
                    >
                      Traditional
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Download Actions */}
                  <div className="flex gap-3">
                    <Button onClick={handleDownloadReceipt} variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Modern Receipt
                    </Button>
                    <Button onClick={handleEmailReceipt} variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Donation Receipt
                    </Button>
                  </div>

                  {/* Receipt Preview */}
                  <div ref={setReceiptRef}>
                    {receiptType === 'modern' ? (
                      <ModernDonationReceipt
                        key={`modern-receipt-${paymentDetails.order_id}`}
                        donationId={paymentDetails.order_id || 'N/A'}
                        donorName={donationData?.donor?.name || "Devotee"}
                        amount={paymentDetails.order_amount || 0}
                        date={paymentDetails.payment_time || donationData?.createdAt || stableDateFallback}
                        purpose={donationData?.donationType === 'general' ? 'Temple Construction' : donationData?.donationType || 'Temple Construction'}
                        paymentMethod={paymentDetails.payment_method || "Online Payment"}
                      />
                    ) : (
                      <DonationReceipt
                        key={`traditional-receipt-${paymentDetails.order_id}`}
                        donationId={paymentDetails.order_id || 'N/A'}
                        donorName={donationData?.donor?.name || "Devotee"}
                        amount={paymentDetails.order_amount || 0}
                        date={paymentDetails.payment_time || donationData?.createdAt || stableDateFallback}
                        purpose={donationData?.donationType === 'general' ? 'Temple Construction' : donationData?.donationType || 'Temple Construction'}
                        paymentMethod={paymentDetails.payment_method || "Online Payment"}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What&apos;s Next?</CardTitle>
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
                    <h4 className="font-semibold">Donation Receipt Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Your official donation receipt will be processed and sent to your email within 24 hours.
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
                      You&apos;ll receive regular updates about the temple construction progress.
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
                      You&apos;ll be invited to the temple inauguration ceremony.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={() => router.push("/")} 
              variant="divine" 
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
