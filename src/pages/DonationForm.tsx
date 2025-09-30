import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowLeft, User, MapPin, CreditCard, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createUser, getUserByEmail, createDonation, updateDonationPayment } from "@/services/donations";
import PaymentModal from "@/components/PaymentModal";
import Header from "@/components/Header";

const donationFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  country: z.string().default("India"),
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
const mapFormFields = (data: any) => {
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
  
  const mappedData: any = {};
  Object.keys(data).forEach(key => {
    const mappedKey = fieldMap[key.toLowerCase()];
    if (mappedKey && data[key]) {
      mappedData[mappedKey] = data[key];
    }
  });
  
  return mappedData;
};

const DonationForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const amount = searchParams.get("amount") || "";
  
  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [donationData, setDonationData] = useState<any>(null);
  const [currentDonationId, setCurrentDonationId] = useState<string | null>(null);

  // Function to prefill form data
  const prefillFormData = (data: any) => {
    const mappedData = mapFormFields(data);
    Object.keys(mappedData).forEach(key => {
      if (mappedData[key]) {
        form.setValue(key as any, mappedData[key]);
      }
    });
  };

  // Check for prefill data in URL parameters
  useEffect(() => {
    const prefillData: any = {};
    searchParams.forEach((value, key) => {
      if (key !== 'amount') {
        prefillData[key] = value;
      }
    });
    
    if (Object.keys(prefillData).length > 0) {
      prefillFormData(prefillData);
    }
  }, [searchParams]);

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


  const onSubmit = async (data: DonationFormData) => {
    try {
      // First, check if user exists or create a new user
      let userResult = await getUserByEmail(data.email);
      let userId = null;

      if (!userResult.success) {
        // User doesn't exist, create new user
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

        userResult = await createUser(userData);
        if (userResult.success) {
          userId = userResult.data.id;
        }
      } else {
        userId = userResult.data.id;
      }

      // Create donation
      const donationData = {
        amount: parseInt(data.amount),
        donation_type: 'general',
        payment_status: 'pending' as const,
        dedication_message: data.message || undefined,
      };

      const donationResult = await createDonation(donationData, userId);
      
      if (donationResult.success) {
        // Generate unique order ID
        const orderId = `YAMRAJ_${Date.now()}_${donationResult.data.id}`;
        
        // Set up payment data
        const paymentData = {
          amount: parseInt(data.amount),
          donorName: data.name,
          donorEmail: data.email,
          donorPhone: data.mobile,
          orderId: orderId,
        };

        setDonationData(paymentData);
        setCurrentDonationId(donationResult.data.id);
        setIsPaymentModalOpen(true);

        toast({
          title: "Donation Form Submitted",
          description: "Please complete your payment to finalize the donation.",
        });
      } else {
        throw new Error(donationResult.error?.message || 'Failed to create donation');
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast({
        title: "Error",
        description: "Failed to submit donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      if (currentDonationId) {
        await updateDonationPayment(currentDonationId, {
          payment_status: 'completed',
          payment_id: paymentData.payment_id || paymentData.order_id,
          payment_gateway: 'cashfree',
        });

        toast({
          title: "Donation Successful!",
          description: "Thank you for your generous donation. You will receive a donation receipt via email.",
        });

        // Redirect to success page or home
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating donation:", error);
      toast({
        title: "Donation Successful",
        description: "Your payment was successful, but there was an issue updating the record. Please contact support.",
      });
    }
  };

  const handlePaymentFailure = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Sponsorship / Donation Form
              </CardTitle>
              <CardDescription>
                Complete your donation to support the temple construction
              </CardDescription>
              {amount && (
                <div className="mt-4 p-4 bg-gradient-peaceful rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    Total Amount: ₹{amount}
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Section 1: Donation Amount */}
                  <div className="space-y-4">
                    <div className="border-b pb-2">
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
                            />
                          </FormControl>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                            {[101, 501, 1001, 2501, 5001, 10001, 25001, 50001].map((amount) => (
                              <Button
                                key={amount}
                                type="button"
                                variant={field.value === amount.toString() ? "divine" : "outline"}
                                size="sm"
                                onClick={() => field.onChange(amount.toString())}
                                className="text-sm"
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
                  <div className="space-y-4">
                    <div className="border-b pb-2">
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
                  <div className="space-y-4">
                    <div className="border-b pb-2">
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
                  <div className="space-y-4">
                    <div className="border-b pb-2">
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

                  <Button type="submit" variant="divine" size="lg" className="w-full">
                    <Heart className="w-4 h-4" />
                    Donate Now
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Payment Modal */}
      {donationData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          donationData={donationData}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}
    </div>
  );
};

export default DonationForm;