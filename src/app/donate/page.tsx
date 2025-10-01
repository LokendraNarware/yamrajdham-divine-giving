'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, User, MapPin, CreditCard, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createUser, getUserByEmail, getUserById, createDonation } from "@/services/donations";
import { useAuth } from "@/contexts/AuthContext";

// Declare Cashfree SDK types
declare global {
  interface Window {
    Cashfree: new (config: { mode: string }) => {
      checkout: (options: { paymentSessionId: string; redirectTarget?: string; mode?: string }) => Promise<unknown>;
    };
  }
}

const donationFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Valid email is required"),
  mobile: z.string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be at most 15 digits")
    .regex(/^(\+91|91)?[6-9]\d{9}$/, "Please enter a valid Indian mobile number (e.g., 9876543210 or +919876543210)"),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pinCode: z.string().optional(),
  panNo: z.string().optional(),
  address: z.string().optional(),
  message: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationFormSchema>;

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];

// Field mapping utility for prefill functionality
interface PrefillData {
  [key: string]: string;
}

const mapFormFields = (data: PrefillData) => {
  const fieldMap: Record<string, string> = {
    // Personal Information
    'donor_name': 'name',
    'donor_name_full': 'name',
    'full_name': 'name',
    'donor_email': 'email',
    'email_address': 'email',
    'donor_phone': 'mobile',
    'donor_mobile': 'mobile',
    'phone_number': 'mobile',
    'mobile_number': 'mobile',
    'pan_number': 'panNo',
    'pan_no': 'panNo',
    
    // Address Information
    'donor_state': 'state',
    'donor_city': 'city',
    'donor_pincode': 'pinCode',
    'pin_code': 'pinCode',
    'postal_code': 'pinCode',
    'donor_address': 'address',
    'full_address': 'address',
    'complete_address': 'address',
    
    // Donation Information
    'donation_amount': 'amount',
    'amount': 'amount',
    'dedication_message': 'message',
    'message': 'message',
    'special_message': 'message',
  };
  
  const mappedData: PrefillData = {};
  Object.keys(data).forEach(key => {
    const mappedKey = fieldMap[key.toLowerCase()];
    if (mappedKey && data[key]) {
      mappedData[mappedKey] = data[key];
    }
  });
  
  return mappedData;
};

export default function DonatePage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const amount = searchParams.get("amount") || "";
  const [isClient, setIsClient] = useState(false);
  
  // Removed unused donation state

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: amount,
      country: "India",
      name: "",
      email: "",
      mobile: "",
      state: "",
      city: "",
      pinCode: "",
      panNo: "",
      address: "",
      message: "",
    },
  });

  // Check for prefill data in URL parameters and user data
  useEffect(() => {
    const prefillData: PrefillData = {};
    
    // First, check URL parameters
    searchParams.forEach((value, key) => {
      if (key !== 'amount') {
        prefillData[key] = value;
      }
    });
    
    // Function to prefill form data
    const prefillFormData = (data: PrefillData) => {
      const mappedData = mapFormFields(data);
      Object.keys(mappedData).forEach(key => {
        if (mappedData[key]) {
          form.setValue(key as keyof DonationFormData, mappedData[key]);
        }
      });
    };
    
    // If user is logged in, fetch their data and prefill
    if (user && !Object.keys(prefillData).length) {
      const fetchUserData = async () => {
        try {
          const result = await getUserById(user.id);
          if (result.success && result.data) {
            const userData = result.data;
            const userPrefillData: PrefillData = {
              name: userData.name || '',
              email: userData.email || '',
              mobile: userData.mobile || '',
              country: userData.country || 'India',
              state: userData.state || '',
              city: userData.city || '',
              pinCode: userData.pin_code || '',
              panNo: userData.pan_no || '',
              address: userData.address || '',
            };
            
            // Only prefill non-empty values
            Object.keys(userPrefillData).forEach(key => {
              if (userPrefillData[key]) {
                form.setValue(key as keyof DonationFormData, userPrefillData[key]);
              }
            });
            
            console.log('User data prefilled from profile');
          }
        } catch (error) {
          console.error('Error fetching user data for prefill:', error);
        }
      };
      
      fetchUserData();
    } else if (Object.keys(prefillData).length > 0) {
      // Use URL prefill data if available
      prefillFormData(prefillData);
    }
  }, [searchParams, user, form]);

  // Set client-side flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);


  const onSubmit = async (data: DonationFormData) => {
    // Prevent multiple submissions
    if (form.formState.isSubmitting) {
      console.log('Form is already submitting, ignoring duplicate submission');
      return;
    }

    try {
      console.log('=== DONATION FORM SUBMISSION STARTED ===');
      console.log('Form data:', data);
      
      // Validate required fields
      if (!data.name || !data.email || !data.mobile || !data.amount) {
        throw new Error('Please fill in all required fields (Name, Email, Mobile, Amount)');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate mobile number
      const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
      if (!mobileRegex.test(data.mobile)) {
        throw new Error('Please enter a valid Indian mobile number');
      }

      // Validate amount
      const amount = parseInt(data.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid donation amount');
      }

      console.log('Form validation passed, proceeding with donation...');
      
      // Auto account creation logic - no login required
      let userId: string | null = null;

      // Check if user already exists by email
      console.log('Checking if user exists by email:', data.email);
      const userResult = await getUserByEmail(data.email);
      
      if (userResult.success && userResult.data) {
        // User exists, use their ID
        console.log('User already exists:', userResult.data.email);
        userId = userResult.data.id;
      } else {
        // User doesn't exist, create new account automatically
        console.log('Creating new user account for:', data.email);
        
        const userData = {
          email: data.email,
          name: data.name,
          mobile: data.mobile,
          address: data.address || undefined,
          city: data.city || undefined,
          state: data.state || undefined,
          pin_code: data.pinCode || undefined,
          country: data.country,
          pan_no: data.panNo || undefined,
        };

        const createUserResult = await createUser(userData);
        if (createUserResult.success && createUserResult.data) {
          userId = createUserResult.data.id;
          console.log('New user account created:', userId);
        } else {
          const errorMessage = createUserResult.error?.message || 'Failed to create user account';
          console.error('User creation failed:', createUserResult.error);
          throw new Error(`Account creation failed: ${errorMessage}`);
        }
      }

      // Create donation
      console.log('Creating donation record...');
      const donationData = {
        amount: amount,
        donation_type: 'general',
        payment_status: 'pending' as const,
        dedication_message: data.message || undefined,
      };

      const donationResult = await createDonation(donationData, userId || undefined);
      
      if (donationResult.success && donationResult.data) {
        // Use donation ID as order ID for Cashfree
        const orderId = donationResult.data.id;
        console.log('Donation created successfully, order ID:', orderId);
        
        // Set up payment data
        const paymentData = {
          amount: amount,
          donorName: data.name,
          donorEmail: data.email,
          donorPhone: data.mobile,
          orderId: orderId,
        };

        console.log('Payment data prepared:', paymentData);
        
        toast({
          title: "Account & Donation Created",
          description: "Account created automatically. Initiating payment...",
        });

        // Directly initiate payment without modal
        await initiateDirectPayment(paymentData);
      } else {
        const errorMessage = donationResult.error?.message || 'Failed to create donation';
        console.error('Donation creation failed:', donationResult.error);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("=== DONATION FORM SUBMISSION ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit donation. Please try again.';
      
      toast({
        title: "Donation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Removed unused handlePaymentSuccess function

  const handlePaymentFailure = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  // Direct payment initiation without modal
  const initiateDirectPayment = async (paymentData: {
    amount: number;
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    orderId: string;
  }) => {
    try {
      console.log('=== PAYMENT INITIATION STARTED ===');
      console.log('Payment data:', paymentData);
      
      // Import the payment functions
      const { createPaymentSession, generateCustomerId } = await import('@/services/cashfree');
      
      // Format phone number for Cashfree API
      const formatPhoneForCashfree = (phone: string): string => {
        const cleaned = phone.replace(/[^\d+]/g, '');
        if (cleaned.startsWith('+91')) return cleaned;
        if (cleaned.startsWith('91')) return '+' + cleaned;
        if (cleaned.length === 10) return '+91' + cleaned;
        return cleaned;
      };

      const sessionData = {
        order_id: paymentData.orderId,
        order_amount: paymentData.amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: generateCustomerId(paymentData.donorEmail),
          customer_name: paymentData.donorName,
          customer_email: paymentData.donorEmail,
          customer_phone: formatPhoneForCashfree(paymentData.donorPhone),
        },
        order_meta: {
          return_url: `${window.location.origin}/donate/success?order_id=${paymentData.orderId}`,
          notify_url: `${window.location.origin}/api/webhook/cashfree`,
        },
      };

      console.log('Session data prepared:', sessionData);

      toast({
        title: "Creating Payment Session",
        description: "Setting up secure payment...",
      });

      const response = await createPaymentSession(sessionData);
      
      console.log('Payment session response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create payment session');
      }

      const originalSessionId = response.data.payment_session_id;
      const cfOrderId = response.data.cf_order_id;
      const paymentUrl = response.data.payment_url;
      
      // Log all available data for debugging
      console.log('Payment session created successfully:');
      console.log('- Session ID:', originalSessionId);
      console.log('- CF Order ID:', cfOrderId);
      console.log('- Payment URL:', paymentUrl);
      
      toast({
        title: "Payment Session Created",
        description: "Opening Cashfree payment page...",
      });

      // Use Cashfree SDK checkout method (most reliable approach)
      console.log('Using Cashfree SDK checkout method...');
      await initializeCashfreeAndCheckout(originalSessionId);

    } catch (error) {
      console.error('=== PAYMENT INITIATION ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment';
      handlePaymentFailure(errorMessage);
    }
  };

  // Open direct payment URL from API
  // Removed unused openDirectPaymentUrl function

  // Initialize Cashfree SDK and open checkout
  const initializeCashfreeAndCheckout = async (sessionId: string) => {
    return new Promise((resolve, reject) => {
      console.log('=== CASHFREE SDK INITIALIZATION ===');
      console.log('Session ID:', sessionId);
      
      // Check if SDK is already loaded
      if (window.Cashfree) {
        console.log('Cashfree SDK already loaded');
        openCheckout(sessionId).then(resolve).catch(reject);
        return;
      }

      // Load Cashfree SDK
      console.log('Loading Cashfree SDK from:', 'https://sdk.cashfree.com/js/v3/cashfree.js');
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      
      script.onload = () => {
        console.log('Cashfree SDK script loaded successfully');
        console.log('Window.Cashfree available:', !!window.Cashfree);
        console.log('Type of window.Cashfree:', typeof window.Cashfree);
        
        if (!window.Cashfree) {
          reject(new Error('Cashfree SDK loaded but window.Cashfree is not available'));
          return;
        }
        
        openCheckout(sessionId).then(resolve).catch(reject);
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Cashfree SDK:', error);
        reject(new Error('Failed to load Cashfree SDK - check network connection'));
      };
      
      document.head.appendChild(script);
    });
  };

  // Open Cashfree checkout using SDK
  const openCheckout = async (sessionId: string) => {
    try {
      console.log("=== OPENING CASHFREE CHECKOUT ===");
      console.log("Session ID:", sessionId);
      console.log("Window.Cashfree available:", !!window.Cashfree);
      
      if (!window.Cashfree) {
        throw new Error('Cashfree SDK not available');
      }
      
      // Create Cashfree instance
      console.log("Creating Cashfree instance...");
      const cashfreeInstance = new window.Cashfree({
        mode: 'SANDBOX'
      });
      
      console.log("Cashfree instance created:", cashfreeInstance);
      console.log("Available methods:", Object.keys(cashfreeInstance || {}));
      
      // Try different checkout options
      const checkoutOptionsList = [
        {
          paymentSessionId: sessionId,
          redirectTarget: "_blank" as string,
          mode: "SANDBOX"
        },
        {
          paymentSessionId: sessionId,
          redirectTarget: "_self" as string,
          mode: "SANDBOX"
        },
        {
          paymentSessionId: sessionId,
          redirectTarget: "_blank" as string,
          mode: "SANDBOX"
        }
      ];
      
      for (let i = 0; i < checkoutOptionsList.length; i++) {
        const checkoutOptions = checkoutOptionsList[i];
        console.log(`Trying checkout options ${i + 1}:`, checkoutOptions);
        
        try {
          // Call checkout method
          const result = await cashfreeInstance.checkout(checkoutOptions);
          console.log("Checkout result:", result);

          // Check if result contains an error
          if (result && typeof result === 'object' && 'error' in result) {
            const errorResult = result as { error: { message?: string } };
            console.error('Checkout returned error:', errorResult.error);
            if (i === checkoutOptionsList.length - 1) {
              throw new Error(errorResult.error.message || 'Checkout failed');
            }
            continue; // Try next option
          } else {
            console.log("Checkout successful with options:", checkoutOptions);
            return; // Success, exit the function
          }
        } catch (checkoutError) {
          console.error(`Checkout attempt ${i + 1} failed:`, checkoutError);
          if (i === checkoutOptionsList.length - 1) {
            throw checkoutError; // Re-throw if this was the last attempt
          }
        }
      }
      
    } catch (error) {
      console.error('=== SDK CHECKOUT ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      
      // Fallback: Try direct URL with different formats
      console.log("SDK failed, trying direct URL fallback...");
      
      // Try multiple URL formats
      const urlFormats = [
        `https://sandbox.cashfree.com/checkout/${sessionId}`,
        `https://sandbox.cashfree.com/pg/checkout/${sessionId}`,
        `https://sandbox.cashfree.com/payments/${sessionId}`,
      ];
      
      for (const url of urlFormats) {
        console.log("Trying URL:", url);
        try {
          const newWindow = window.open(url, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
          if (newWindow) {
            console.log("Successfully opened payment window with URL:", url);
            newWindow.focus();
            
            toast({
              title: "Payment Window Opened",
              description: "Please complete your payment in the new window",
            });
            
            return; // Success, exit the function
          }
        } catch (urlError) {
          console.error("Failed to open URL:", url, urlError);
        }
      }
      
      // If all URLs fail, redirect in same window
      console.log("All popup attempts failed, redirecting in same window...");
      window.location.href = urlFormats[0];
      
      toast({
        title: "Redirecting to Payment",
        description: "Opening payment page in current window",
      });
    }
  };

  return (
    <div className="w-full">

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
                Sponsorship / Donation Form
              </CardTitle>
              <CardDescription className="text-base">
                Complete your donation to support the temple construction
              </CardDescription>
              {amount && (
                <div className="mt-6 p-4 bg-gradient-peaceful rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary">
                    Total Amount: ₹{amount}
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                  {/* Section 1: Donation Amount */}
                  <div className="space-y-6">
                    <div className="border-b border-border/50 pb-3">
                      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        1. Donation Details
                      </h3>
                    </div>
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Donation Amount *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter amount"
                              {...field}
                              type="number"
                              min="1"
                              className="h-11 text-base"
                            />
                          </FormControl>
                          <div className="grid grid-cols-4 gap-3 mt-4">
                            {[101, 501, 1001, 2501, 5001, 10001, 25001, 50001].map((amount) => (
                              <Button
                                key={amount}
                                type="button"
                                variant={field.value === amount.toString() ? "divine" : "outline"}
                                size="sm"
                                onClick={() => field.onChange(amount.toString())}
                                className="text-sm font-medium"
                              >
                                ₹{amount.toLocaleString()}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Section 2: Personal Information */}
                  <div className="space-y-6">
                    <div className="border-b border-border/50 pb-3">
                      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <User className="w-5 h-5" />
                        2. Personal Information
                      </h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name of Donor *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile/Phone *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your mobile number"
                                type="tel"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="panNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN No</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter PAN number"
                              {...field}
                              style={{ textTransform: "uppercase" }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Section 3: Address Information */}
                  <div className="space-y-6">
                    <div className="border-b border-border/50 pb-3">
                      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        3. Address Information
                      </h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {indianStates.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pinCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pin/Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter pin/zip code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complete Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your complete address"
                              {...field}
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Section 4: Additional Information */}
                  <div className="space-y-6">
                    <div className="border-b border-border/50 pb-3">
                      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        4. Additional Information
                      </h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dedication Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special message or dedication (optional)"
                              {...field}
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      variant="divine" 
                      size="lg" 
                      className="w-full h-12 text-lg font-semibold"
                      disabled={form.formState.isSubmitting}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      {form.formState.isSubmitting ? "Processing..." : "Donate Now"}
                    </Button>
                    
                    {/* Debug buttons - only show on client side to prevent hydration mismatch */}
                    {isClient && process.env.NODE_ENV === 'development' && (
                      <div className="mt-4 space-y-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            console.log('=== FORM DEBUG INFO ===');
                            console.log('Form values:', form.getValues());
                            console.log('Form errors:', form.formState.errors);
                            console.log('Form is valid:', form.formState.isValid);
                            console.log('Form is dirty:', form.formState.isDirty);
                            console.log('Form is submitting:', form.formState.isSubmitting);
                            
                            // Show specific validation errors
                            const errors = form.formState.errors;
                            Object.keys(errors).forEach(field => {
                              console.log(`Field ${field}:`, errors[field as keyof typeof errors]);
                            });
                            
                            toast({
                              title: "Debug Info",
                              description: "Check browser console for form details",
                            });
                          }}
                        >
                          Debug Form (Check Console)
                        </Button>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={async () => {
                            console.log('=== TESTING CASHFREE SDK ===');
                            console.log('Window.Cashfree available:', !!window.Cashfree);
                            
                            if (window.Cashfree) {
                              console.log('Cashfree SDK is already loaded');
                              toast({
                                title: "Cashfree SDK Status",
                                description: "SDK is loaded and available",
                              });
                            } else {
                              console.log('Loading Cashfree SDK...');
                              try {
                                await initializeCashfreeAndCheckout('test-session-id');
                                toast({
                                  title: "Cashfree SDK Test",
                                  description: "SDK loading test completed - check console",
                                });
                              } catch (error) {
                                console.error('Cashfree SDK test failed:', error);
                                toast({
                                  title: "Cashfree SDK Test Failed",
                                  description: error instanceof Error ? error.message : 'Unknown error',
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                        >
                          Test Cashfree SDK
                        </Button>
                        
                        <Button 
                          type="button" 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            console.log('=== SANDBOX TEST INFORMATION ===');
                            console.log('Test Card Details for Sandbox:');
                            console.log('Visa Debit: 4706131211212123');
                            console.log('Visa Credit: 4576238912771450');
                            console.log('Mastercard Debit: 5409162669381034');
                            console.log('Mastercard Credit: 5105105105105100');
                            console.log('Expiry: 03/2028');
                            console.log('CVV: 123');
                            console.log('Name: Test');
                            console.log('OTP: 111000');
                            console.log('');
                            console.log('Test UPI:');
                            console.log('Success: testsuccess@gocash');
                            console.log('Failure: testfailure@gocash');
                            console.log('Invalid: testinvalid@gocash');
                            
                            toast({
                              title: "Sandbox Test Data",
                              description: "Check console for test card details",
                            });
                          }}
                        >
                          Show Sandbox Test Data
                        </Button>
                        
                        <Button 
                          type="button" 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            // Fill form with test data
                            form.setValue('name', 'Test User');
                            form.setValue('email', 'test@example.com');
                            form.setValue('mobile', '9876543210');
                            form.setValue('amount', '1101');
                            form.setValue('country', 'India');
                            form.setValue('state', 'Maharashtra');
                            form.setValue('city', 'Mumbai');
                            form.setValue('pinCode', '400001');
                            form.setValue('address', 'Test Address, Mumbai');
                            form.setValue('message', 'Test donation');
                            
                            toast({
                              title: "Test Data Loaded",
                              description: "Form filled with test data for easy testing",
                            });
                          }}
                        >
                          Fill Test Data
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
