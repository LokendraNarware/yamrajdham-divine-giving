"use client";

import { DollarSign, Users, TrendingUp, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminStats, useInvalidateAdminData } from "@/hooks/use-dashboard-data";

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
  const { user } = useAuth();
  const { data: stats, isLoading, error, refetch } = useAdminStats();
  const { invalidateStats } = useInvalidateAdminData();

  const handleRefresh = () => {
    invalidateStats();
    refetch();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Show loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-red-600">Failed to load dashboard data</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">Error: {error.message}</p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  // Use default values if stats is undefined
  const dashboardStats = stats || {
    totalDonations: 0,
    totalAmount: 0,
    totalUsers: 0,
    completedDonations: 0,
    pendingDonations: 0,
    failedDonations: 0,
    refundedDonations: 0,
    systemStatus: 'error' as const,
    systemMessage: 'Unable to load system status',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Welcome to the admin panel!</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalDonations}
              </div>
              <p className="text-xs text-gray-500">
                {dashboardStats.totalDonations === 0 ? 'No completed donations yet' : 'Completed donations only'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(dashboardStats.totalAmount)}
              </div>
              <p className="text-xs text-gray-500">
                {dashboardStats.totalAmount === 0 ? 'No funds raised' : 'From completed donations only'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalUsers}
              </div>
              <p className="text-xs text-gray-500">
                {dashboardStats.totalUsers === 0 ? 'No users yet' : 'Registered users'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                dashboardStats.systemStatus === 'healthy' ? 'text-green-600' :
                dashboardStats.systemStatus === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {dashboardStats.systemStatus === 'healthy' ? 'Healthy' :
                 dashboardStats.systemStatus === 'warning' ? 'Warning' :
                 'Error'}
              </div>
              <p className="text-xs text-gray-500">
                {dashboardStats.systemMessage}
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
                {dashboardStats.completedDonations}
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
                {dashboardStats.pendingDonations}
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
                {dashboardStats.failedDonations}
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
                {dashboardStats.refundedDonations}
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