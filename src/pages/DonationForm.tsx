import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createUser, getUserByEmail, createDonation } from "@/services/donations";

const donationFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  country: z.string().default("India"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pinCode: z.string().min(1, "Pin/Zip code is required"),
  panNo: z.string().optional(),
  preacher: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  message: z.string().optional(),
}).refine((data) => {
  const amount = parseInt(data.amount);
  if (amount > 10000 && !data.panNo) {
    return false;
  }
  return true;
}, {
  message: "PAN No. is mandatory for donations above ₹10,000",
  path: ["panNo"],
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

const DonationForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const amount = searchParams.get("amount") || "";

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
      preacher: "",
      address: "",
      message: "",
    },
  });

  const watchedAmount = form.watch("amount");
  const showPanField = parseInt(watchedAmount || "0") > 10000;

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
          address: data.address,
          city: data.city,
          state: data.state,
          pin_code: data.pinCode,
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
        preacher_name: data.preacher || undefined,
      };

      const donationResult = await createDonation(donationData, userId);
      
      if (donationResult.success) {
        toast({
          title: "Donation Form Submitted",
          description: "Thank you for your generous donation. You will be redirected to payment.",
        });
        console.log("Donation created successfully:", donationResult.data);
        // Here you would typically redirect to payment gateway
        // For now, we'll just show success message
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-divine rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-divine bg-clip-text text-transparent">
              Yamrajdham
            </span>
          </div>
        </div>
      </header>

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
                  {parseInt(amount) > 10000 && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Note: PAN No. is Mandatory only for donation amount above ₹10,000
                    </div>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                          <FormLabel>State *</FormLabel>
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
                          <FormLabel>City *</FormLabel>
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
                          <FormLabel>Pin/Zip Code *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter pin/zip code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {showPanField && (
                    <FormField
                      control={form.control}
                      name="panNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN No *</FormLabel>
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
                  )}

                  <FormField
                    control={form.control}
                    name="preacher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name of Iskcon Preacher who interacted with you</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter preacher name (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address *</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
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

                  <Button type="submit" variant="divine" size="lg" className="w-full">
                    <Heart className="w-4 h-4" />
                    Proceed to Payment
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DonationForm;