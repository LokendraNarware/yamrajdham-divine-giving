"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDonations, updateDonationPayment } from "@/services/donations";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, CheckCircle, XCircle, Shield, LogOut } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Donation {
  id: string;
  user_id: string | null;
  amount: number;
  donation_type: string | null;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_id: string | null;
  payment_gateway: string | null;
  receipt_number: string | null;
  is_anonymous: boolean | null;
  dedication_message: string | null;
  preacher_name: string | null;
  created_at: string | null;
  updated_at: string | null;
  users?: {
    id: string;
    name: string;
    email: string;
    mobile: string;
  } | null;
}

export default function DonationsListPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const fetchDonations = async () => {
    try {
      const result = await getDonations();
      if (result.success) {
        setDonations(result.data || []);
      } else {
        throw new Error('Failed to fetch donations');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch donations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Check admin authentication
  useEffect(() => {
    const checkAdminAuth = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        // Check if user exists in admin table
        const { data: adminData, error } = await supabase
          .from('admin')
          .select('*')
          .eq('email', user.email)
          .eq('is_active', true)
          .single();

        if (error || !adminData) {
          console.log('User is not an admin:', error);
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges to access this page.",
            variant: "destructive",
          });
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);
        setCheckingAuth(false);
        fetchDonations();
      } catch (error) {
        console.error('Error checking admin auth:', error);
        toast({
          title: "Error",
          description: "Failed to verify admin access.",
          variant: "destructive",
        });
        router.push('/dashboard');
      }
    };

    checkAdminAuth();
  }, [user, router, toast]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDonations();
  };

  const handlePaymentStatusUpdate = async (id: string, status: 'completed' | 'failed') => {
    try {
      const result = await updateDonationPayment(id, { payment_status: status });
      if (result.success) {
        toast({
          title: "Success",
          description: `Payment status updated to ${status}`,
        });
        await fetchDonations(); // Refresh the list
      } else {
        throw new Error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Shield className="w-8 h-8 animate-pulse mx-auto mb-4" />
              <p>Verifying admin access...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-4 text-red-500" />
              <p>Access Denied</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading donations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            Admin Panel - Donations Management
          </h1>
          <p className="text-muted-foreground">View and manage all donations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {donations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No donations found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <Card key={donation.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {donation.users?.name || 'Anonymous Donor'}
                    </CardTitle>
                    <CardDescription>
                      {donation.users?.email || 'N/A'} • {donation.users?.mobile || 'N/A'}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ₹{donation.amount.toLocaleString('en-IN')}
                    </div>
                    {getStatusBadge(donation.payment_status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p><strong>Donation Type:</strong> {donation.donation_type || 'General'}</p>
                    <p><strong>Date:</strong> {formatDate(donation.created_at || '')}</p>
                    {donation.payment_id && <p><strong>Payment ID:</strong> {donation.payment_id}</p>}
                    {donation.preacher_name && <p><strong>Preacher:</strong> {donation.preacher_name}</p>}
                  </div>
                  <div>
                    {donation.dedication_message && (
                      <div>
                        <p><strong>Dedication Message:</strong></p>
                        <p className="text-sm text-muted-foreground italic">&ldquo;{donation.dedication_message}&rdquo;</p>
                      </div>
                    )}
                    {donation.is_anonymous && (
                      <p className="text-sm text-muted-foreground">Anonymous Donation</p>
                    )}
                  </div>
                </div>
                
                {donation.payment_status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handlePaymentStatusUpdate(donation.id, 'completed')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Completed
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handlePaymentStatusUpdate(donation.id, 'failed')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Mark Failed
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
