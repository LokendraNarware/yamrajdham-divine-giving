'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, useUserDonations, useUserStats, useInvalidateUserData } from '@/hooks/use-dashboard-data';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/admin/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar, DollarSign, Heart, LogOut, Filter, Eye, RefreshCw } from 'lucide-react';

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
  const [statusFilter, setStatusFilter] = useState<string>('completed');
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Use cached data hooks
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useUserProfile(user?.id || '');
  const { data: donations = [], isLoading: donationsLoading, error: donationsError } = useUserDonations(user?.id || '');
  const { data: userStats, isLoading: statsLoading } = useUserStats(user?.id || '');
  const { invalidateAll: invalidateUserData } = useInvalidateUserData(user?.id || '');

  const isLoading = profileLoading || donationsLoading || statsLoading;
  const hasError = profileError || donationsError;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  // Filter donations based on status (exclude refunded donations) using useMemo
  const filteredDonations = useMemo(() => {
    // First filter out refunded donations
    const nonRefundedDonations = (donations as any).filter((donation: any) => donation.payment_status !== 'refunded');
    
    if (statusFilter === 'all') {
      return nonRefundedDonations;
    } else {
      return nonRefundedDonations.filter((donation: any) => donation.payment_status === statusFilter);
    }
  }, [donations, statusFilter]);

  const handleRefresh = () => {
    invalidateUserData();
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

  // Memoize expensive calculations using cached data (exclude refunded donations)
  const donationStats = useMemo(() => {
    // Filter out refunded donations from all calculations
    const nonRefundedDonations = (donations as any).filter((d: any) => d.payment_status !== 'refunded');
    const completedDonations = nonRefundedDonations.filter((d: any) => d.payment_status === 'completed');
    const totalAmount = userStats?.totalAmount || completedDonations.reduce((sum: number, d: any) => sum + d.amount, 0);
    const totalCount = userStats?.totalCount || completedDonations.length;
    
    return {
      totalAmount,
      totalCount,
      completedDonations
    };
  }, [donations, userStats]);


  // Show error state
  if (hasError) {
    return (
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground">Error loading dashboard data</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">
                  {profileError?.message || donationsError?.message || 'Failed to load dashboard data'}
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
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
                Welcome back, {(userProfile as any)?.name || 'User'}!
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
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
                  {(userProfile as any)?.created_at ? 
                    new Date((userProfile as any).created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) :
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
              {filteredDonations.length === 0 ? (
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
                  data={filteredDonations as unknown as Record<string, unknown>[]}
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
