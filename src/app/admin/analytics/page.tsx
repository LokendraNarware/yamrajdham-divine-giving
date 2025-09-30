"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  monthlyTrends: Array<{
    month: string;
    donations: number;
    revenue: number;
  }>;
  donationSources: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalDonations: 0,
    activeDonors: 0,
    averageDonation: 0,
    recentDonations: [],
    monthlyTrends: [],
    donationSources: [],
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

      // Fetch ALL completed donations for comprehensive analytics
      const { data: donationsData, error: donationsError } = await supabase
        .from('user_donations')
        .select(`
          id,
          amount,
          created_at,
          donation_type,
          user:users(name)
        `)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });

      if (donationsError) {
        console.error('Error fetching donations:', donationsError);
      }

      // Calculate analytics
      const donations = donationsData || [];
      const totalRevenue = donations.reduce((sum, d) => sum + d.amount, 0);
      const totalDonations = donations.length;
      const uniqueDonors = new Set(donations.map(d => d.user?.name)).size;
      const averageDonation = totalDonations > 0 ? totalRevenue / totalDonations : 0;

      // Generate monthly trends data (last 6 months)
      const monthlyTrends = generateMonthlyTrends(donations);
      
      // Generate donation sources data
      const donationSources = generateDonationSources(donations);

      setAnalyticsData({
        totalRevenue,
        totalDonations,
        activeDonors: uniqueDonors,
        averageDonation,
        recentDonations: donations.slice(0, 10).map(d => ({
          id: d.id,
          amount: d.amount,
          donor_name: d.user?.name || 'Anonymous',
          created_at: d.created_at,
        })),
        monthlyTrends,
        donationSources,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
  };

  const generateMonthlyTrends = (donations: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const trends = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const monthDonations = donations.filter(d => {
        const donationDate = new Date(d.created_at);
        return donationDate.getFullYear() === date.getFullYear() && 
               donationDate.getMonth() === date.getMonth();
      });

      trends.push({
        month: months[date.getMonth()],
        donations: monthDonations.length,
        revenue: monthDonations.reduce((sum, d) => sum + d.amount, 0),
      });
    }

    return trends;
  };

  const generateDonationSources = (donations: any[]) => {
    const sources = donations.reduce((acc, donation) => {
      const type = donation.donation_type || 'general';
      acc[type] = (acc[type] || 0) + donation.amount;
      return acc;
    }, {});

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
    
    return Object.entries(sources).map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value as number,
      color: colors[index % colors.length],
    }));
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
            <CardTitle>Donation Trends (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading chart data...</p>
                  </div>
                </div>
              ) : analyticsData.monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'donations' ? `${value} donations` : `₹${value}`,
                        name === 'donations' ? 'Donations' : 'Revenue'
                      ]}
                    />
                    <Bar dataKey="donations" fill="#8884d8" name="Donations" />
                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No donation data available</p>
                    <p className="text-sm text-gray-400">Monthly trends will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Sources Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading chart data...</p>
                  </div>
                </div>
              ) : analyticsData.donationSources.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.donationSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.donationSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No donation data available</p>
                    <p className="text-sm text-gray-400">Source breakdown will appear here</p>
                  </div>
                </div>
              )}
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
