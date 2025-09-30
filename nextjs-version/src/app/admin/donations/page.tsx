"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/admin/DataTable";
import AdminLayout from "@/components/admin/AdminLayout";

interface Donation {
  id: string;
  user_id: string;
  amount: number;
  donation_type: string;
  payment_status: string;
  payment_id: string;
  payment_gateway: string;
  receipt_number: string;
  is_anonymous: boolean;
  dedication_message: string;
  preacher_name: string;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
    mobile: string;
  };
}

interface DashboardStats {
  totalDonations: number;
  totalAmount: number;
  pendingDonations: number;
  completedDonations: number;
  failedDonations: number;
  refundedDonations: number;
}

export default function DonationsManagement() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    totalAmount: 0,
    pendingDonations: 0,
    completedDonations: 0,
    failedDonations: 0,
    refundedDonations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  // Fetch donations on component mount
  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      
      // Fetch donations with user data
      const { data: donationsData, error } = await supabase
        .from('user_donations')
        .select(`
          *,
          user:users(name, email, mobile)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDonations(donationsData || []);
      calculateStats(donationsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast({
        title: "Error",
        description: "Failed to load donations.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const calculateStats = (donationsData: Donation[]) => {
    // Only count completed donations for totals
    const completedDonations = donationsData.filter(d => d.payment_status === 'completed');
    const pendingDonations = donationsData.filter(d => d.payment_status === 'pending');
    const failedDonations = donationsData.filter(d => d.payment_status === 'failed');
    const refundedDonations = donationsData.filter(d => d.payment_status === 'refunded');
    
    // Calculate totals ONLY from completed donations
    const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);
    
    const stats = {
      totalDonations: completedDonations.length, // Only completed donations count
      totalAmount: totalAmount, // Only completed donations amount
      pendingDonations: pendingDonations.length,
      completedDonations: completedDonations.length,
      failedDonations: failedDonations.length,
      refundedDonations: refundedDonations.length,
    };
    
    console.log('Donations Stats Calculation:', {
      totalDonations: donationsData.length,
      completedDonations: completedDonations.length,
      pendingDonations: pendingDonations.length,
      totalAmount: totalAmount,
      completedAmounts: completedDonations.map(d => d.amount)
    });
    
    setStats(stats);
  };

  const handleStatusChange = async (donationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('user_donations')
        .update({ 
          payment_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Donation status updated to ${newStatus}.`,
      });

      // Refresh donations
      fetchDonations();
    } catch (error) {
      console.error('Error updating donation status:', error);
      toast({
        title: "Error",
        description: "Failed to update donation status.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Donor Name', 'Email', 'Amount', 'Status', 'Type', 'Date', 'Receipt Number'].join(','),
      ...donations.map(donation => [
        donation.id,
        donation.user?.name || 'Anonymous',
        donation.user?.email || '',
        donation.amount,
        donation.payment_status,
        donation.donation_type,
        new Date(donation.created_at).toLocaleDateString(),
        donation.receipt_number || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Donations data exported successfully.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      completed: { variant: "default" as const, label: "Completed" },
      failed: { variant: "destructive" as const, label: "Failed" },
      refunded: { variant: "outline" as const, label: "Refunded" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: 'receipt_number',
      label: 'Receipt #',
      sortable: true,
      render: (value: string, row: Donation) => (
        <span className="font-mono text-sm">
          {value || `DON-${row.id.slice(-8).toUpperCase()}`}
        </span>
      )
    },
    {
      key: 'user',
      label: 'Donor',
      sortable: true,
      render: (value: any, row: Donation) => (
        <div>
          <div className="font-medium">
            {row.is_anonymous ? 'Anonymous' : (value?.name || 'Unknown')}
          </div>
          <div className="text-sm text-gray-500">
            {row.is_anonymous ? '' : (value?.email || '')}
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'donation_type',
      label: 'Type',
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      )
    },
    {
      key: 'payment_status',
      label: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {formatDate(value)}
        </span>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Donations Management</h2>
          <p className="text-gray-600">Manage temple donations and track contributions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Donations</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedDonations}</div>
              <p className="text-xs text-gray-500">Successfully processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Donations</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingDonations}</div>
              <p className="text-xs text-gray-500">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{donations.length}</div>
              <p className="text-xs text-gray-500">All donations (completed + pending + failed + refunded)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalAmount)}
              </div>
              <p className="text-xs text-gray-500">
                {stats.totalAmount === 0 ? 'No funds raised' : 'From completed donations only'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Summary Information */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Donation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-green-600">{stats.completedDonations}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-yellow-600">{stats.pendingDonations}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-red-600">{stats.failedDonations}</div>
                <div className="text-xs text-gray-600">Failed</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-blue-600">{donations.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600 text-center">
              <p><strong>Total Amount:</strong> {formatCurrency(stats.totalAmount)} (from completed donations only)</p>
            </div>
          </CardContent>
        </Card>

        {/* Donations Table */}
        <DataTable
          data={donations}
          columns={columns}
          searchKey="receipt_number"
          searchPlaceholder="Search by receipt number, donor name, or email..."
          onRowClick={setSelectedDonation}
          onStatusChange={handleStatusChange}
          onExport={handleExport}
          loading={loading}
        />

        {/* Donation Details Modal */}
        {selectedDonation && (
          <Card className="fixed inset-4 z-50 overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Donation Details</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedDonation(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Receipt Number</label>
                  <p className="text-lg font-mono">
                    {selectedDonation.receipt_number || `DON-${selectedDonation.id.slice(-8).toUpperCase()}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(selectedDonation.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedDonation.payment_status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="capitalize">{selectedDonation.donation_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Donor Name</label>
                  <p>{selectedDonation.is_anonymous ? 'Anonymous' : (selectedDonation.user?.name || 'Unknown')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p>{selectedDonation.is_anonymous ? 'Hidden' : (selectedDonation.user?.email || 'N/A')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mobile</label>
                  <p>{selectedDonation.is_anonymous ? 'Hidden' : (selectedDonation.user?.mobile || 'N/A')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p>{formatDate(selectedDonation.created_at)}</p>
                </div>
              </div>
              
              {selectedDonation.dedication_message && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Dedication Message</label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedDonation.dedication_message}
                  </p>
                </div>
              )}

              {selectedDonation.preacher_name && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Preacher Name</label>
                  <p>{selectedDonation.preacher_name}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedDonation.payment_status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => {
                        handleStatusChange(selectedDonation.id, 'completed');
                        setSelectedDonation(null);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Completed
                    </Button>
                    <Button 
                      onClick={() => {
                        handleStatusChange(selectedDonation.id, 'failed');
                        setSelectedDonation(null);
                      }}
                      variant="destructive"
                    >
                      Mark Failed
                    </Button>
                  </>
                )}
                <Button 
                  onClick={() => setSelectedDonation(null)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
