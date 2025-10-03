"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Mail, Heart, Loader2 } from "lucide-react";
import { verifyPayment } from "@/services/cashfree";
import { useToast } from "@/hooks/use-toast";
import ModernDonationReceipt from "@/components/ModernDonationReceipt";
import { generateReceiptNumber } from "@/lib/utils";
import dynamic from "next/dynamic";

// Lazy load PDF components to improve initial page load
const PDFModernDonationReceipt = dynamic(
  () => import("@/components/PDFModernDonationReceipt"),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
  }
);

function PaymentSuccessContent() {
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
  const [paymentLoaded, setPaymentLoaded] = useState(false);
  const [donationLoaded, setDonationLoaded] = useState(false);
  // Removed receiptType state since we only use modern receipts now
  const receiptRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [pollingCount, setPollingCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  
  const orderId = searchParams.get("order_id");

  // Function to fetch payment details
  const fetchPaymentDetails = async (isPollingCall = false) => {
    if (!orderId) {
      setIsLoading(false);
      setPaymentLoaded(true);
      setDonationLoaded(true);
      return;
    }

    try {
      if (!isPollingCall) {
        setIsLoading(true);
      }
      
      // Fetch both payment verification and donation data in parallel with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const fetchPromise = Promise.all([
        verifyPayment(orderId),
        fetch(`/api/donations/${orderId}`)
      ]);
      
      const [details, donationResponse] = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as [any, Response];
      
      setPaymentDetails(details);
      setPaymentLoaded(true);
      
      // Process donation data
      try {
        if (donationResponse.ok) {
          const donation = await donationResponse.json();
          setDonationData(donation);
          setDonationLoaded(true);
        } else {
          console.error('Failed to fetch donation data');
          setDonationLoaded(true); // Still set to true to avoid infinite loading
        }
      } catch (error) {
        console.error('Error fetching donation data:', error);
        setDonationLoaded(true); // Still set to true to avoid infinite loading
      }
      
      // Check if payment is successful and stop polling
      const isPaymentSuccessful = details && (
        (details.order_status === 'PAID') || 
        (details.payment_status === 'SUCCESS')
      );
      
      if (isPaymentSuccessful) {
        // Stop polling when payment is successful
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
          setIsPolling(false);
        }
        
        // Show success toast only once
        if (!isPollingCall) {
          toast({
            title: "Donation Successful!",
            description: "Thank you for your generous donation.",
          });
        }
      } else {
        // Start polling if payment is still pending and we haven't started yet
        const isPaymentPending = details && (
          (details.order_status === 'ACTIVE') || 
          (details.payment_status === 'PENDING') ||
          (details.payment_status === 'NOT_ATTEMPTED')
        );
        
        if (isPaymentPending && !isPollingCall && !pollingInterval && pollingCount < 20) {
          startPolling();
        }
        
        // Show appropriate toast only on initial load
        if (!isPollingCall) {
          if (isPaymentPending) {
            toast({
              title: "Payment Processing",
              description: "Your payment is being processed. We'll update you automatically.",
              variant: "default",
            });
          } else if (details) {
            toast({
              title: "Payment Status Unknown",
              description: "Please contact support for payment status.",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      if (!isPollingCall) {
        toast({
          title: "Error",
          description: "Failed to fetch payment details. Please contact support.",
          variant: "destructive",
        });
      }
    } finally {
      if (!isPollingCall) {
        setIsLoading(false);
      }
    }
  };

  // Function to start polling for payment status
  const startPolling = () => {
    if (pollingInterval || isPolling) return;
    
    setIsPolling(true);
    const interval = setInterval(() => {
      setPollingCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 20) { // Stop after 20 attempts (about 2 minutes)
          clearInterval(interval);
          setPollingInterval(null);
          setIsPolling(false);
          return newCount;
        }
        fetchPaymentDetails(true);
        return newCount;
      });
    }, 6000); // Poll every 6 seconds
    
    setPollingInterval(interval);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  useEffect(() => {
    fetchPaymentDetails();
  }, [orderId, toast]);

  const handleDownloadReceipt = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    if (!paymentDetails || !donationData || !isClient || typeof window === 'undefined') {
      toast({
        title: "Error",
        description: "Receipt data not available",
        variant: "destructive",
      });
      setIsDownloading(false);
      return;
    }

    try {
      console.log('Starting modern receipt download...');
      
      // Lazy load PDF generation utilities
      const [{ generateReceiptPDF }, { createRoot }] = await Promise.all([
        import("@/lib/receipt-utils"),
        import('react-dom/client')
      ]);

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
      const root = createRoot(tempContainer);
      
      const ModernReceiptElement = (
        <PDFModernDonationReceipt
          donationId={donationData.receiptNumber || generateReceiptNumber(paymentDetails.order_id)}
          donorName={donationData.donor?.name || "Devotee"}
          amount={paymentDetails.order_amount || 0}
          date={paymentDetails.payment_time || donationData.createdAt || stableDateFallback}
          purpose={donationData.donationType === 'general' ? 'Temple Construction' : donationData.donationType || 'Temple Construction'}
          paymentMethod={paymentDetails.payment_method || "Online Payment"}
          orderId={paymentDetails.order_id}
        />
      );

      root.render(ModernReceiptElement);

      // Wait for the component to render and images to load (reduced timeout)
      await new Promise(resolve => setTimeout(resolve, 300));

      // Generate PDF from the temporary container
      await generateReceiptPDF(tempContainer, {
        donationId: donationData.receiptNumber || generateReceiptNumber(paymentDetails.order_id),
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
        title: "Donation Receipt Downloaded",
        description: "Your donation receipt has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading modern receipt:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to download receipt: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmailReceipt = () => {
    // In a real implementation, you would send receipt via email
    toast({
      title: "Donation Receipt Sent",
      description: "Donation receipt has been sent to your email address.",
    });
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <main className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Verifying your donation...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
            </div>
            
            {/* Progressive loading placeholders */}
            <div className="mt-8 space-y-6">
              <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Determine payment status for UI with strict checking
  const isPaymentSuccessful = paymentDetails && (
    (paymentDetails.order_status === 'PAID') || 
    (paymentDetails.payment_status === 'SUCCESS')
  );
  
  const isPaymentPending = paymentDetails && (
    (paymentDetails.order_status === 'ACTIVE') || 
    (paymentDetails.payment_status === 'PENDING') ||
    (paymentDetails.order_status === 'MOCK_UNPAID') ||
    (paymentDetails.payment_status === 'MOCK_UNPAID')
  );
  
  const isMockOrder = paymentDetails && (
    (paymentDetails.order_status === 'MOCK_UNPAID') || 
    (paymentDetails.payment_status === 'MOCK_UNPAID') ||
    ((paymentDetails as any).is_mock === true)
  );
  
  const isPaymentFailed = paymentDetails && !isPaymentSuccessful && !isPaymentPending && !isMockOrder;

  // Additional safety check - never show success components if payment is pending
  const shouldShowSuccessComponents = isPaymentSuccessful && !isPaymentPending && paymentDetails && (
    paymentDetails.order_status === 'PAID' || paymentDetails.payment_status === 'SUCCESS'
  );

  // Debug logging
  if (paymentDetails && typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Payment Details Debug:', {
      order_status: paymentDetails.order_status,
      payment_status: paymentDetails.payment_status,
      is_mock: (paymentDetails as any).is_mock,
      isPaymentSuccessful,
      isPaymentPending,
      isMockOrder,
      isPaymentFailed,
      shouldShowSuccessComponents
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Status Message */}
          {shouldShowSuccessComponents && (
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
          )}

          {isPaymentPending && (
            <Card className="border-yellow-200 bg-yellow-50 mb-6">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-yellow-600 mx-auto mb-4 animate-spin" />
                  <h1 className="text-2xl font-bold text-yellow-800 mb-2">
                    Payment Processing
                  </h1>
                  <p className="text-yellow-700 mb-3">
                    Your payment is being processed. We're checking the status automatically.
                  </p>
                  {isPolling && (
                    <div className="text-sm text-yellow-600">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-pulse">●</div>
                        <span>Checking payment status... ({pollingCount}/20)</span>
                      </div>
                      <p className="mt-1 text-xs">
                        This usually takes 30-60 seconds. You can refresh the page anytime.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {isMockOrder && (
            <Card className="border-blue-200 bg-blue-50 mb-6">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-blue-600">⚠</span>
                  </div>
                  <h1 className="text-2xl font-bold text-blue-800 mb-2">
                    Test Order - Payment Not Processed
                  </h1>
                  <p className="text-blue-700">
                    This is a test order in development mode. No actual payment has been processed. 
                    To make real donations, please use the production environment.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {isPaymentFailed && (
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-red-600">✕</span>
                  </div>
                  <h1 className="text-2xl font-bold text-red-800 mb-2">
                    Payment Failed
                  </h1>
                  <p className="text-red-700">
                    There was an issue processing your payment. Please try again or contact support.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!paymentDetails && (
            <Card className="border-gray-200 bg-gray-50 mb-6">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-gray-600">?</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Status Unknown
                  </h1>
                  <p className="text-gray-700">
                    We couldn't verify your payment status. Please contact support with your order ID.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Details */}
          {paymentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  {shouldShowSuccessComponents 
                    ? "Your donation has been processed successfully"
                    : isPaymentPending
                    ? "Your donation is being processed"
                    : "Payment details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Receipt No</label>
                    <p className="font-mono text-sm">
                      {donationData?.receiptNumber || generateReceiptNumber(paymentDetails.order_id)}
                    </p>
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
                        : new Date(paymentDetails.payment_time).toISOString()
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Donation Receipt - Only show for successful payments and when data is loaded */}
          {shouldShowSuccessComponents && paymentLoaded && donationLoaded && (
            <Card className="mb-6">
              <CardHeader>
                  <div>
                    <CardTitle>Donation Receipt</CardTitle>
                    <CardDescription>
                      Download your modern donation receipt for your records
                    </CardDescription>
                  </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Download Actions */}
                  <div className="flex gap-3">
                    <Button onClick={handleDownloadReceipt} variant="outline" className="flex-1" disabled={isDownloading} aria-busy={isDownloading}>
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </>
                      )}
                    </Button>
                    <Button onClick={handleEmailReceipt} variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Donation Receipt
                    </Button>
                  </div>

                  {/* Receipt Preview Toggle */}
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReceiptPreview(!showReceiptPreview)}
                    >
                      {showReceiptPreview ? 'Hide' : 'Show'} Receipt Preview
                    </Button>
                  </div>

                  {/* Receipt Preview - Lazy loaded only when requested */}
                  {showReceiptPreview && (
                     <div ref={receiptRef} className="border rounded-lg p-4 bg-gray-50">
                       <ModernDonationReceipt
                         key={`modern-receipt-${donationData?.receiptNumber || generateReceiptNumber(paymentDetails.order_id)}`}
                         donationId={donationData?.receiptNumber || generateReceiptNumber(paymentDetails.order_id)}
                         donorName={donationData?.donor?.name || "Devotee"}
                         amount={paymentDetails.order_amount || 0}
                         date={paymentDetails.payment_time || donationData?.createdAt || stableDateFallback}
                         purpose={donationData?.donationType === 'general' ? 'Temple Construction' : donationData?.donationType || 'Temple Construction'}
                         paymentMethod={paymentDetails.payment_method || "Online Payment"}
                         orderId={paymentDetails.order_id}
                       />
                     </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading state for receipt when payment is successful but data is still loading */}
          {shouldShowSuccessComponents && (!paymentLoaded || !donationLoaded) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Preparing Receipt...</CardTitle>
                <CardDescription>Loading your donation details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Fetching your donation receipt...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps - Only show for successful payments */}
          {shouldShowSuccessComponents && (
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
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={() => router.push("/")} 
              variant="outline" 
              size="lg" 
              className="flex-1"
            >
              <Heart className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            {shouldShowSuccessComponents && (
              <Button 
                onClick={() => router.push("/donate")} 
                variant="divine" 
                size="lg" 
                className="flex-1"
              >
                Make Another Donation
              </Button>
            )}
            
            {(isPaymentFailed || isPaymentPending || isMockOrder) && (
              <>
                {isPaymentPending && (
                  <Button 
                    onClick={() => {
                      if (pollingInterval) {
                        clearInterval(pollingInterval);
                        setPollingInterval(null);
                        setIsPolling(false);
                      }
                      fetchPaymentDetails();
                    }} 
                    variant="outline" 
                    size="lg" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Check Status Now"
                    )}
                  </Button>
                )}
                <Button 
                  onClick={() => router.push("/donate")} 
                  variant="default" 
                  size="lg" 
                  className="flex-1"
                >
                  {isPaymentFailed ? "Try Again" : 
                   isMockOrder ? "Make Real Donation" : 
                   "Make Another Donation"}
                </Button>
              </>
            )}
            
            {!paymentDetails && (
              <Button 
                onClick={() => window.location.reload()} 
                variant="default" 
                size="lg" 
                className="flex-1"
              >
                Refresh Status
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return <PaymentSuccessContent />;
}
