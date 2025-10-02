"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MapPin, Edit, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserById, updateUser } from "@/services/donations";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().optional(), // Email is disabled, so we don't validate it
  mobile: z.string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be at most 15 digits")
    .regex(/^(\+91|91)?[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pin_code: z.string().optional(),
  pan_no: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];


export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actualUserId, setActualUserId] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      country: "India",
      state: "",
      city: "",
      pin_code: "",
      pan_no: "",
      address: "",
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Fetch user data and donations
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          console.log('Fetching user data for user ID:', user.id);
          
          // First fetch user data
          const userResult = await getUserById(user.id);
          console.log('User result:', userResult);
          console.log('Auth user email:', user.email);
          console.log('Auth user ID:', user.id);

          let actualUserId = user.id; // Default to auth user ID

          if (userResult.success && userResult.data) {
            const userData = userResult.data;
            actualUserId = userData.id; // Use the actual database user ID
            form.reset({
              name: userData.name || "",
              email: userData.email || user.email || "", // Use auth user email as fallback
              mobile: userData.mobile || "",
              country: userData.country || "India",
              state: userData.state || "",
              city: userData.city || "",
              pin_code: userData.pin_code || "",
              pan_no: userData.pan_no || "",
              address: userData.address || "",
            });
            // Store the actual user ID from the database for updates
            setActualUserId(userData.id);
          } else {
            // If user data not found in users table, use auth user data
            form.reset({
              name: "",
              email: user.email || "",
              mobile: "",
              country: "India",
              state: "",
              city: "",
              pin_code: "",
              pan_no: "",
              address: "",
            });
          }

        } catch (error) {
          console.error('Error fetching user data:', error);
          console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error: error
          });
          toast({
            title: "Error",
            description: `Failed to load profile data: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user, form, toast]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      console.log('Updating user profile with data:', data);
      // Use the actual user ID from the database if available, otherwise use auth user ID
      const userIdToUse = actualUserId || user.id;
      console.log('User ID:', userIdToUse);
      
      const result = await updateUser(userIdToUse, data);
      console.log('Update result:', result);
      
      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
        setIsEditing(false);
      } else {
        console.error('Update failed:', result.error);
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      getUserById(user.id).then(result => {
        if (result.success && result.data) {
          const userData = result.data;
          form.reset({
            name: userData.name || "",
            email: userData.email || user.email || "", // Use auth user email as fallback
            mobile: userData.mobile || "",
            country: userData.country || "India",
            state: userData.state || "",
            city: userData.city || "",
            pin_code: userData.pin_code || "",
            pan_no: userData.pan_no || "",
            address: userData.address || "",
          });
        } else {
          // If user data not found, use auth user data
          form.reset({
            name: "",
            email: user.email || "",
            mobile: "",
            country: "India",
            state: "",
            city: "",
            pin_code: "",
            pan_no: "",
            address: "",
          });
        }
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="bg-background">
        {/* Header removed - using global layout */}
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading profile...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background">
        {/* Header removed - using global layout */}

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your account information</p>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={form.handleSubmit(onSubmit)} variant="divine">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email" 
                              {...field} 
                              disabled={true} // Email shouldn't be editable
                              className="bg-muted"
                            />
                          </FormControl>
                          <p className="text-sm text-muted-foreground">
                            Email cannot be changed after registration
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number *</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="Enter your mobile number" 
                              {...field} 
                              disabled={!isEditing} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pan_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter PAN number" 
                              {...field} 
                              disabled={!isEditing}
                              style={{ textTransform: "uppercase" }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </CardTitle>
                <CardDescription>
                  Update your address and location details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <div className="space-y-4">
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
                          <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your city" {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pin_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pin Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter pin code" {...field} disabled={!isEditing} />
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
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
