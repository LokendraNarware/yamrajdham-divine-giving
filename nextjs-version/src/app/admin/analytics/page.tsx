"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AnalyticsData {
  totalRevenue: number;
  totalDonations: number;
  activeDonors: number;
  averageDonation: number;
  recentDonations: Array<{
    id: string;
    amount: number;
    donor_name: string;
    created_at: string;
  }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalDonations: 0,
    activeDonors: 0,
    averageDonation: 0,
    recentDonations: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch completed donations with user data
      const { data: donationsData, error: donationsError } = await supabase
        .from('user_donations')
        .select(`
          id,
          amount,
          created_at,
          user:users(name)
        `)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);

      if (donationsError) {
        console.error('Error fetching donations:', donationsError);
      }

      // Calculate analytics
      const donations = donationsData || [];
      const totalRevenue = donations.reduce((sum, d) => sum + d.amount, 0);
      const totalDonations = donations.length;
      const uniqueDonors = new Set(donations.map(d => d.user?.name)).size;
      const averageDonation = totalDonations > 0 ? totalRevenue / totalDonations : 0;

      setAnalyticsData({
        totalRevenue,
        totalDonations,
        activeDonors: uniqueDonors,
        averageDonation,
        recentDonations: donations.map(d => ({
          id: d.id,
          amount: d.amount,
          donor_name: d.user?.name || 'Anonymous',
          created_at: d.created_at,
        })),
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
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
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-gray-600">Track performance and insights</p>
          </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatCurrency(analyticsData.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.totalRevenue > 0 ? 'From completed donations only' : 'No revenue yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : analyticsData.totalDonations}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.totalDonations > 0 ? 'Completed donations only' : 'No completed donations yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : analyticsData.activeDonors}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.activeDonors > 0 ? 'Donors with completed donations' : 'No donors yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Donation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatCurrency(analyticsData.averageDonation)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.averageDonation > 0 ? 'Per completed donation' : 'No data yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chart visualization will be implemented here</p>
                <p className="text-sm text-gray-400">Monthly donation trends over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Pie chart will be implemented here</p>
                <p className="text-sm text-gray-400">Donation sources breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading recent donations...</p>
              </div>
            ) : analyticsData.recentDonations.length > 0 ? (
              analyticsData.recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium">Donation from {donation.donor_name}</p>
                      <p className="text-sm text-gray-500">{formatDate(donation.created_at)}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(donation.amount)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent donations found</p>
                <p className="text-sm text-gray-400">Donations will appear here once they are completed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
}
