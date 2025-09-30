"use client";

import { useState, useEffect } from "react";
import { DollarSign, Users, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalDonations: number;
  totalAmount: number;
  totalUsers: number;
  completedDonations: number;
  pendingDonations: number;
  failedDonations: number;
  refundedDonations: number;
  systemStatus: 'healthy' | 'warning' | 'error';
  systemMessage: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    totalAmount: 0,
    totalUsers: 0,
    completedDonations: 0,
    pendingDonations: 0,
    failedDonations: 0,
    refundedDonations: 0,
    systemStatus: 'healthy',
    systemMessage: 'All systems operational',
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const checkSystemHealth = async () => {
    try {
      // Test database connection
      const { error: dbError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      // Test payment gateway (basic check)
      const paymentGatewayHealthy = process.env.NEXT_PUBLIC_CASHFREE_APP_ID && 
                                   process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY;

      if (dbError) {
        return {
          status: 'error' as const,
          message: 'Database connection failed'
        };
      }

      if (!paymentGatewayHealthy) {
        return {
          status: 'warning' as const,
          message: 'Payment gateway not configured'
        };
      }

      return {
        status: 'healthy' as const,
        message: 'All systems operational'
      };
    } catch (error) {
      return {
        status: 'error' as const,
        message: 'System health check failed'
      };
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch ONLY completed donations for calculations
      const { data: completedDonationsData, error: completedDonationsError } = await supabase
        .from('user_donations')
        .select('amount, payment_status')
        .eq('payment_status', 'completed');

      if (completedDonationsError) {
        console.error('Error fetching completed donations:', completedDonationsError);
      }

      // Fetch all donations for status counts (but not for calculations)
      const { data: allDonationsData, error: allDonationsError } = await supabase
        .from('user_donations')
        .select('payment_status');

      if (allDonationsError) {
        console.error('Error fetching all donations:', allDonationsError);
      }

      // Fetch users count
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id', { count: 'exact' });

      if (usersError) {
        console.error('Error fetching users:', usersError);
      }

      // Check system health
      const systemHealth = await checkSystemHealth();

      // Calculate stats - ONLY use completed donations for totals
      const completedDonations = completedDonationsData || [];
      const allDonations = allDonationsData || [];
      
      const totalDonations = completedDonations.length; // Only completed donations count
      const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0); // Only completed donations
      const completedDonationsCount = completedDonations.length;
      const pendingDonations = allDonations.filter(d => d.payment_status === 'pending').length;
      const failedDonations = allDonations.filter(d => d.payment_status === 'failed').length;
      const refundedDonations = allDonations.filter(d => d.payment_status === 'refunded').length;
      const totalUsers = usersData?.length || 0;

      setStats({
        totalDonations,
        totalAmount,
        totalUsers,
        completedDonations: completedDonationsCount,
        pendingDonations,
        failedDonations,
        refundedDonations,
        systemStatus: systemHealth.status,
        systemMessage: systemHealth.message,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({
        ...prev,
        systemStatus: 'error',
        systemMessage: 'Failed to load dashboard data'
      }));
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Welcome to the admin panel!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.totalDonations}
              </div>
              <p className="text-xs text-gray-500">
                {stats.totalDonations === 0 ? 'No completed donations yet' : 'Completed donations only'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? '...' : formatCurrency(stats.totalAmount)}
              </div>
              <p className="text-xs text-gray-500">
                {stats.totalAmount === 0 ? 'No funds raised' : 'From completed donations only'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.totalUsers}
              </div>
              <p className="text-xs text-gray-500">
                {stats.totalUsers === 0 ? 'No users yet' : 'Registered users'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                stats.systemStatus === 'healthy' ? 'text-green-600' :
                stats.systemStatus === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {loading ? '...' : (
                  stats.systemStatus === 'healthy' ? 'Healthy' :
                  stats.systemStatus === 'warning' ? 'Warning' :
                  'Error'
                )}
              </div>
              <p className="text-xs text-gray-500">
                {loading ? 'Checking...' : stats.systemMessage}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? '...' : stats.completedDonations}
              </div>
              <p className="text-xs text-gray-500">Successful donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {loading ? '...' : stats.pendingDonations}
              </div>
              <p className="text-xs text-gray-500">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {loading ? '...' : stats.failedDonations}
              </div>
              <p className="text-xs text-gray-500">Failed transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Refunded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? '...' : stats.refundedDonations}
              </div>
              <p className="text-xs text-gray-500">Refunded donations</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => window.location.href = '/admin/donations'}
                >
                  <DollarSign className="w-4 h-4 mr-3" />
                  Manage Donations
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => window.location.href = '/admin/users'}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Manage Users
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => window.location.href = '/admin/analytics'}
                >
                  <TrendingUp className="w-4 h-4 mr-3" />
                  View Analytics
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => window.location.href = '/admin/reports'}
                >
                  <Download className="w-4 h-4 mr-3" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Info */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Access Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You have successfully accessed the admin panel. Manage donations, users, and view analytics.
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Admin User:</strong> {user?.email || 'Loading...'}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Access Level:</strong> {user?.email?.includes('admin') || user?.email?.includes('yamrajdham.org') ? 'Administrator' : 'User'}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Login Time:</strong> {new Date().toLocaleString('en-IN')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}