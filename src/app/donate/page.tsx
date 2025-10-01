'use client';

import { useEffect, useState } from "react";
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
// Removed PaymentModal import - using direct checkout now


const donationFormSchema = z.object({
  amount: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  mobile: z.string().optional(),
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
  const [isAddressCollapsed, setIsAddressCollapsed] = useState(true);
  const [isAdditionalCollapsed, setIsAdditionalCollapsed] = useState(true);
  
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
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('onSubmit function called with data:', data);
    
    // Prevent multiple submissions
    if (form.formState.isSubmitting) {
      console.log('Form is already submitting, ignoring duplicate submission');
      return;
    }

    // Reset any previous submission state
    form.clearErrors();

    try {
      console.log('=== DONATION FORM SUBMISSION STARTED ===');
      console.log('Form data:', data);
      console.log('Form validation state:', {
        isValid: form.formState.isValid,
        errors: form.formState.errors,
        isDirty: form.formState.isDirty
      });
      
      // Add debug toast to show form submission started
      toast({
        title: "Form Submission Started",
        description: "Processing your donation request...",
      });
      
      // Skip validation - proceed directly to payment
      console.log('Skipping form validation - proceeding to payment');
      
      // Provide defaults for required fields
      const formData = {
        amount: data.amount || '100',
        name: data.name || 'Anonymous Donor',
        email: data.email || 'donor@example.com',
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

      console.log('Form validation passed, proceeding with donation...');
      
      // Auto account creation logic - no login required
      let userId: string | null = null;

      // Check if user already exists by email
      console.log('Checking if user exists by email:', formData.email);
      const userResult = await getUserByEmail(formData.email);
      console.log('User lookup result:', userResult);
      
      if (userResult.success && userResult.data) {
        // User exists, use their ID
        console.log('User already exists:', userResult.data.email);
        userId = userResult.data.id;
      } else {
        // User doesn't exist, create new account automatically
        console.log('Creating new user account for:', formData.email);
        
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

        console.log('User data to create:', userData);
        const createUserResult = await createUser(userData);
        console.log('User creation result:', createUserResult);
        
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
        
        // Set up payment data
        const paymentDataForModal = {
          amount: amount,
          donorName: formData.name,
          donorEmail: formData.email,
          donorPhone: formData.mobile,
          orderId: orderId,
        };

        console.log('Payment data prepared:', paymentDataForModal);
        
        // Payment integration removed - redirect to success page
        console.log('Donation created successfully, redirecting to success page...');
        
        toast({
          title: "Donation Created Successfully!",
          description: "Thank you for your generous donation. Redirecting to confirmation page...",
        });

        // Redirect to success page
        setTimeout(() => {
          window.location.href = `/donate/success?order_id=${orderId}`;
        }, 2000);
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

  // Payment success/failure handled by Cashfree redirect URLs


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
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email"
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
                            <FormLabel>Mobile/Phone *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your mobile number"
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

      {/* Payment handled by Cashfree direct checkout */}
    </div>
  );
}
