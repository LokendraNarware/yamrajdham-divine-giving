'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, User, MapPin, CreditCard, MessageSquare, ChevronDown, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createUser, getUserByEmail, getUserById, createDonation } from "@/services/donations";
import { useAuth } from "@/contexts/AuthContext";
import { createPaymentSession, generateCustomerId, formatPhoneForCashfree } from "@/services/cashfree";
// Removed PaymentModal import - using direct payment gateway redirect

// Cashfree SDK types are already declared globally


const donationFormSchema = z.object({
  amount: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(), // Made optional
  mobile: z.string().min(1, "Mobile number is required"), // Made required
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

function DonatePageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const amount = searchParams.get("amount") || "";
  // Removed isClient state to fix hydration issues
  const [isAddressCollapsed, setIsAddressCollapsed] = useState(true);
  const [isAdditionalCollapsed, setIsAdditionalCollapsed] = useState(true);
  // Removed payment modal state - using direct redirect

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

  // Removed client-side flag to fix hydration issues


  const onSubmit = async (data: DonationFormData) => {
    
    // Show immediate feedback to user
    toast({
      title: "Processing Donation",
      description: "Starting payment process...",
    });
    
    
    
    // Reset any previous submission state
    form.clearErrors();

    try {
      
      // Provide defaults for required fields
      const formData = {
        amount: data.amount || '100',
        name: data.name || 'Anonymous Donor',
        email: data.email || `${data.mobile || 'donor'}@donor.local`,
        mobile: data.mobile || '9876543210',
        country: data.country || 'India',
        state: data.state || '',
        city: data.city || '',
        pinCode: data.pinCode || '',
        panNo: data.panNo || '',
        address: data.address || '',
        message: data.message || '',
      };
      
      // Parse amount with fallback
      const amount = parseInt(formData.amount) || 100; // Default to 100 if invalid

      // Auto account creation logic - no login required
      let userId: string | null = null;

      // Check if user already exists by email
      const userResult = await getUserByEmail(formData.email);
      
      if (userResult.success && userResult.data) {
        // User exists, use their ID
        userId = userResult.data.id;
      } else {
        // User doesn't exist, create new account automatically
        
        const userData = {
          email: formData.email,
          name: formData.name,
          mobile: formData.mobile,
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          pin_code: formData.pinCode || undefined,
          country: formData.country,
          pan_no: formData.panNo || undefined,
        };

        const createUserResult = await createUser(userData);
        
        if (createUserResult.success && createUserResult.data) {
          userId = createUserResult.data.id;
          console.log('New user account created:', userId);
        } else {
          const errorMessage = createUserResult.error?.message || 'Failed to create user account';
          console.error('User creation failed:', createUserResult.error);
          console.error('User creation error details:', JSON.stringify(createUserResult.error, null, 2));
          
          // If it's a duplicate email error, try to get the existing user
          if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
            console.log('User already exists, trying to get existing user...');
            const existingUserResult = await getUserByEmail(formData.email);
            if (existingUserResult.success && existingUserResult.data) {
              userId = existingUserResult.data.id;
              console.log('Found existing user:', userId);
            } else {
              throw new Error(`Account creation failed: ${errorMessage}`);
            }
          } else {
            throw new Error(`Account creation failed: ${errorMessage}`);
          }
        }
      }

      // Create donation
      console.log('Creating donation record...');
      const donationData = {
        amount: amount,
        donation_type: 'general',
        payment_status: 'pending' as const,
        dedication_message: formData.message || undefined,
      };

      console.log('Donation data to create:', donationData);
      console.log('User ID for donation:', userId);
      
      const donationResult = await createDonation(donationData, userId || undefined);
      console.log('Donation creation result:', donationResult);
      
      if (donationResult.success && donationResult.data) {
        // Use donation ID as order ID for Cashfree
        const orderId = donationResult.data.id;
        console.log('Donation created successfully, order ID:', orderId);
        
        console.log('Donation created successfully, proceeding to payment...');
        
        // Create payment session and redirect to payment gateway
        try {
          console.log('Creating payment session for direct redirect...');
          
          const sessionData = {
            order_id: orderId,
            order_amount: amount,
            order_currency: 'INR',
            customer_details: {
              customer_id: generateCustomerId(formData.mobile),
              customer_name: formData.name,
              customer_email: formData.email || `${formData.mobile}@donor.local`, // Use mobile-based email if no email provided
              customer_phone: formatPhoneForCashfree(formData.mobile),
            },
            order_meta: {
              return_url: `${window.location.origin}/donate/success?order_id=${orderId}`,
              notify_url: `${window.location.origin}/api/webhook/cashfree`,
            },
          };

          console.log('Session data:', sessionData);
          console.log('Customer ID generated:', generateCustomerId(formData.mobile));
          console.log('Phone formatted:', formatPhoneForCashfree(formData.mobile));
          
          toast({
            title: "Creating Payment Session",
            description: "Redirecting to secure payment gateway...",
          });

          const paymentResponse = await createPaymentSession(sessionData);
          console.log('Payment session response:', paymentResponse);
          console.log('Payment response success:', paymentResponse.success);
          console.log('Payment response data:', paymentResponse.data);
          
          
          
          
          if (paymentResponse.success && paymentResponse.data) {
            // Check if this is a mock response (credentials not configured)
            if (paymentResponse.message?.includes('Mock payment session')) {
              console.log('Mock payment session detected, redirecting to success page');
              toast({
                title: "Test Mode",
                description: "Payment gateway not configured. Redirecting to success page for testing...",
              });
              
              setTimeout(() => {
                if (paymentResponse.data?.payment_url) {
                  window.location.href = paymentResponse.data.payment_url;
                }
              }, 2000);
            } else {
              // For now, use manual redirect approach since SDK has browser compatibility issues
              console.log('Payment response data:', paymentResponse.data);
              console.log('Payment session ID:', paymentResponse.data.payment_session_id);
              
              if (!paymentResponse.data.payment_session_id) {
                throw new Error('Payment session ID not received from server');
              }
              
              toast({
                title: "Payment Gateway",
                description: "Redirecting to secure payment gateway...",
              });
              
              // Use Cashfree JavaScript SDK for hosted checkout
              console.log('=== INITIALIZING CASHFREE CHECKOUT ===');
              
              const sessionId = paymentResponse.data.payment_session_id;
              console.log('Payment Session ID:', sessionId);
              
              // Debug: Check what's available on window
              console.log('Window object keys:', Object.keys(window).filter(key => key.toLowerCase().includes('cashfree')));
              console.log('window.Cashfree available:', typeof (window as any).Cashfree);
              console.log('window.cashfree available:', typeof (window as any).cashfree);
              
              // Wait a bit for SDK to load if not immediately available
              const waitForCashfreeSDK = async (maxAttempts = 15) => {
                for (let i = 0; i < maxAttempts; i++) {
                  if ((window as any).Cashfree) {
                    console.log('Cashfree SDK found after', i + 1, 'attempts');
                    return true;
                  }
                  console.log('Waiting for Cashfree SDK... attempt', i + 1);
                  await new Promise(resolve => setTimeout(resolve, 300));
                }
                
                // If SDK still not found, try to load it dynamically
                console.log('SDK not found, attempting to load dynamically...');
                try {
                  await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
                    script.onload = () => {
                      console.log('Cashfree SDK loaded dynamically');
                      resolve(true);
                    };
                    script.onerror = () => {
                      console.error('Failed to load Cashfree SDK dynamically');
                      reject(new Error('SDK load failed'));
                    };
                    document.head.appendChild(script);
                  });
                  
                  // Wait a bit more for the SDK to initialize
                  await new Promise(resolve => setTimeout(resolve, 500));
                  return !!(window as any).Cashfree;
                } catch (error) {
                  console.error('Failed to load Cashfree SDK:', error);
                  return false;
                }
              };
              
              try {
                const sdkReady = await waitForCashfreeSDK();
                
                if (sdkReady) {
                  console.log('Cashfree SDK ready, initializing checkout...');
                  
                  // Initialize Cashfree SDK
                  const cashfree = (window as any).Cashfree({
                    mode: "sandbox" // Use "production" for live environment
                  });
                  
                  // Show user what's happening
                  toast({
                    title: "Opening Payment Gateway",
                    description: "Redirecting to Cashfree's secure payment page...",
                  });
                  
                  // Open Cashfree checkout
                  const checkoutOptions = {
                    paymentSessionId: sessionId,
                    redirectTarget: "_self" // Opens in same tab
                  };
                  
                  console.log('Opening checkout with options:', checkoutOptions);
                  cashfree.checkout(checkoutOptions);
                  
                } else {
                  console.error('Cashfree SDK not found after waiting, falling back to manual redirect');
                  throw new Error('SDK not available');
                }
                
              } catch (error) {
                console.error('Error with Cashfree SDK:', error);
                console.log('Falling back to manual redirect...');
                
                // Fallback: Manual redirect using documented hosted checkout URL
                const environment = 'sandbox';
                const paymentUrl = `https://${environment}.cashfree.com/pg/view/checkout?payment_session_id=${encodeURIComponent(sessionId)}`;
                
                console.log('Fallback - Manual redirect to:', paymentUrl);
                
                toast({
                  title: "Redirecting to Payment Gateway",
                  description: "Opening Cashfree payment page...",
                });
                
                window.location.href = paymentUrl;
              }
            }
          } else {
            console.log('Payment session creation failed:', paymentResponse);
            console.log('Success:', paymentResponse.success);
            console.log('Data:', paymentResponse.data);
            console.log('Message:', paymentResponse.message);
            throw new Error(paymentResponse.message || 'Failed to create payment session');
          }
        } catch (paymentError) {
          console.error('Payment session creation failed:', paymentError);
          toast({
            title: "Payment Error",
            description: "Failed to create payment session. Please try again.",
            variant: "destructive",
          });
        }
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

  // Payment modal handlers removed - using direct redirect now


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
                          {/* <FormMessage /> */}
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
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email (optional)"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            {/* <FormMessage /> */}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile/Phone * (Required)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your mobile number (required)"
                                type="tel"
                                {...field}
                              />
                            </FormControl>
                            {/* <FormMessage /> */}
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
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Section 3: Address Information */}
                  <div className="space-y-6">
                    <div className="border-b border-border/50 pb-3">
                      <h3 
                        className="text-lg font-semibold text-primary flex items-center gap-2 cursor-pointer hover:text-primary/80 transition-colors"
                        onClick={() => setIsAddressCollapsed(!isAddressCollapsed)}
                      >
                        <MapPin className="w-5 h-5" />
                        3. Address Information
                        {isAddressCollapsed ? (
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-auto" />
                        )}
                      </h3>
                    </div>
                    
                    {!isAddressCollapsed && (
                      <div className="space-y-4">
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
                            {/* <FormMessage /> */}
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
                            {/* <FormMessage /> */}
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
                            {/* <FormMessage /> */}
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
                            {/* <FormMessage /> */}
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
                              {/* <FormMessage /> */}
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  {/* Section 4: Additional Information */}
                  <div className="space-y-6">
                    <div className="border-b border-border/50 pb-3">
                      <h3 
                        className="text-lg font-semibold text-primary flex items-center gap-2 cursor-pointer hover:text-primary/80 transition-colors"
                        onClick={() => setIsAdditionalCollapsed(!isAdditionalCollapsed)}
                      >
                        <MessageSquare className="w-5 h-5" />
                        4. Additional Information
                        {isAdditionalCollapsed ? (
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-auto" />
                        )}
                      </h3>
                    </div>
                    
                    {!isAdditionalCollapsed && (
                      <div className="space-y-4">
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
                              {/* <FormMessage /> */}
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      variant="divine" 
                      size="lg" 
                      className="w-full h-12 text-lg font-semibold"
                      disabled={form.formState.isSubmitting}
                      onClick={(e) => {
                        console.log('Donate Now button clicked!');
                        console.log('Form state:', form.formState);
                        console.log('Form values:', form.getValues());
                      }}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      {form.formState.isSubmitting ? "Processing..." : "Donate Now"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment handled by direct redirect to payment gateway */}
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading donation form...</p>
        </div>
      </div>
    }>
      <DonatePageContent />
    </Suspense>
  );
}
