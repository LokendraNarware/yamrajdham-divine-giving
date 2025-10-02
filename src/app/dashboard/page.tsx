'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/admin/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar, DollarSign, Heart, LogOut, Filter, Eye } from 'lucide-react';

interface Donation {
  id: string;
  amount: number;
  donation_type: string;
  payment_status: string;
  dedication_message?: string;
  created_at: string;
  payment_id?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  created_at: string;
}

export default function DashboardPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('completed');
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Add a small delay to prevent flash of loading state for fast responses
    const timeoutId = setTimeout(() => {
      fetchUserData();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [user, router]);

  // Filter donations based on status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredDonations(donations);
    } else {
      const filtered = donations.filter(donation => donation.payment_status === statusFilter);
      setFilteredDonations(filtered);
    }
  }, [donations, statusFilter]);

  const fetchUserData = async () => {
    if (!user) return;

    console.log('Fetching data for user:', user.id, user.email);

    try {
      // Use Promise.all to fetch user profile and donations in parallel
      const [profileResult, donationsResult] = await Promise.allSettled([
        // Optimized user profile query with better error handling
        supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(), // Use maybeSingle instead of single to avoid errors when no data found
        
        // Fetch donations immediately with user.id (most common case)
        supabase
          .from('user_donations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50) // Limit to recent 50 donations for better performance
      ]);

      let resolvedUserProfile: UserProfile | null = null;

      // Handle user profile result
      if (profileResult.status === 'fulfilled') {
        const { data: profileData, error: profileError } = profileResult.value;
        
        if (profileData) {
          console.log('User profile found:', profileData);
          resolvedUserProfile = profileData;
        } else if (!profileError || profileError.code === 'PGRST116') {
          // Profile doesn't exist, try to find by email or create
          console.log('User profile not found, checking by email...');
          
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();
          
          if (existingUser) {
            console.log('Found existing user by email:', existingUser.email);
            resolvedUserProfile = existingUser;
          } else {
            console.log('Creating new user profile...');
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .upsert({
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                mobile: user.user_metadata?.phone || '',
              }, {
                onConflict: 'id'
              })
              .select()
              .single();
            
            if (!createError && newProfile) {
              console.log('User profile created:', newProfile);
              resolvedUserProfile = newProfile;
            } else {
              console.error('Error creating user profile:', createError);
            }
          }
        } else {
          console.error('Error fetching user profile:', profileError);
        }
      }

      // Set the resolved user profile
      setUserProfile(resolvedUserProfile);

      // Handle donations result
      if (donationsResult.status === 'fulfilled') {
        const { data: donationsData, error: donationsError } = donationsResult.value;
        
        if (donationsError) {
          console.error('Error fetching donations:', donationsError);
        } else {
          console.log('Found donations:', donationsData?.length || 0);
          setDonations(donationsData || []);
        }
      } else {
        console.error('Error fetching donations:', donationsResult.reason);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Memoize expensive calculations
  const donationStats = useMemo(() => {
    const completedDonations = donations.filter(d => d.payment_status === 'completed');
    const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalCount = completedDonations.length;
    
    return {
      totalAmount,
      totalCount,
      completedDonations
    };
  }, [donations]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {userProfile?.name || 'User'}!
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donationStats.totalCount}</div>
                <p className="text-xs text-muted-foreground">
                  Completed donations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{donationStats.totalAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully donated
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userProfile?.created_at ? 
                    new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) :
                    'N/A'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Account created
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Donations Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>
                    View all your donations and open slips
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your journey of giving by making your first donation.
                  </p>
                  <Button onClick={() => router.push('/donate')}>
                    Make a Donation
                  </Button>
                </div>
              ) : (
                <DataTable
                  data={donations as unknown as Record<string, unknown>[]}
                  columns={[
                    { key: 'id', label: 'Donation ID', sortable: true },
                    { key: 'amount', label: 'Amount', sortable: true, render: (v) => `₹${Number(v || 0).toLocaleString()}` },
                    { key: 'donation_type', label: 'Type', sortable: true },
                    { key: 'payment_status', label: 'Status', sortable: true, render: (v) => getStatusBadge(String(v)) },
                    { key: 'created_at', label: 'Date', sortable: true, render: (v) => formatDate(String(v)) },
                    { 
                      key: 'actions', 
                      label: 'View Slip', 
                      sortable: false, 
                      render: (_, row) => {
                        const paymentStatus = String(row.payment_status || '').toLowerCase();
                        if (paymentStatus === 'completed') {
                          return (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                const orderId = String(row.id);
                                router.push(`/donate/success?order_id=${orderId}`);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Slip
                            </Button>
                          );
                        }
                        return (
                          <span className="text-sm text-muted-foreground">
                            -
                          </span>
                        );
                      }
                    },
                  ]}
                  searchKey="id"
                  searchPlaceholder="Search by ID, name, or email"
                  showActions={false}
                  onRowClick={(row) => {
                    const paymentStatus = String(row.payment_status || '').toLowerCase();
                    if (paymentStatus === 'completed') {
                      const orderId = String(row.id);
                      router.push(`/donate/success?order_id=${orderId}`);
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
