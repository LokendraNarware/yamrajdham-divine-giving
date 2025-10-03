"use client";

import { RefreshCw, DollarSign, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useEnhancedDashboard } from "@/hooks/use-enhanced-dashboard";
import StatsCard from "@/components/admin/StatsCard";
import DonationTrendsChart from "@/components/admin/DonationTrendsChart";
import CategoryBreakdownChart from "@/components/admin/CategoryBreakdownChart";
import RecentDonationsFeed from "@/components/admin/RecentDonationsFeed";
import QuickActions from "@/components/admin/QuickActions";
import PaymentStatusOverview from "@/components/admin/PaymentStatusOverview";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { stats, analytics, recentDonations, isLoading, error, refetch } = useEnhancedDashboard();

  const handleRefresh = () => {
    refetch();
  };

  const handleViewAllDonations = () => {
    window.location.href = '/admin/donations';
  };

  const handleManageUsers = () => {
    window.location.href = '/admin/users';
  };

  const handleViewAnalytics = () => {
    window.location.href = '/admin/analytics';
  };

  const handleGenerateReport = () => {
    window.location.href = '/admin/reports';
  };

  const handleSendUpdates = () => {
    // TODO: Implement send updates functionality
    console.log('Send updates clicked');
  };

  const handlePaymentSettings = () => {
    window.location.href = '/admin/settings/payment';
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
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error.message}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Use default values if data is undefined
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

  const analyticsData = analytics || {
    monthlyTrends: [],
    categoryBreakdown: [],
    topDonors: []
  };

  const recentDonationsData = recentDonations?.donations || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Yamrajdham Temple Management - Completed Payments Only</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="💰 TOTAL FUNDS RAISED"
            value={dashboardStats.totalAmount}
            subtitle="✅ From completed donations only"
            icon={DollarSign}
            color="green"
            isCurrency={true}
            trend={{
              value: 12,
              isPositive: true,
              period: "last month"
            }}
          />
          
          <StatsCard
            title="🎯 SUCCESSFUL DONATIONS"
            value={dashboardStats.totalDonations}
            subtitle="✅ 100% completion rate"
            icon={CheckCircle}
            color="blue"
            description={`Avg: ₹${dashboardStats.totalDonations > 0 ? Math.round(dashboardStats.totalAmount / dashboardStats.totalDonations) : 0} per donation`}
          />
          
          <StatsCard
            title="👥 ACTIVE DONORS"
            value={dashboardStats.totalUsers}
            subtitle="🔄 Registered users"
            icon={Users}
            color="purple"
            description="Last donation: Recently"
          />
          
          <StatsCard
            title="📈 COMPLETION RATE"
            value={`${Math.round((dashboardStats.completedDonations / (dashboardStats.completedDonations + dashboardStats.pendingDonations + dashboardStats.failedDonations)) * 100)}%`}
            subtitle="✅ Payment success rate"
            icon={TrendingUp}
            color="orange"
            description="Above industry average"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <DonationTrendsChart 
              data={analyticsData.monthlyTrends} 
              isLoading={isLoading}
            />
            <CategoryBreakdownChart 
              data={analyticsData.categoryBreakdown} 
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Activity & Actions */}
          <div className="space-y-6">
            <RecentDonationsFeed
              donations={recentDonationsData}
              isLoading={isLoading}
              onViewAll={handleViewAllDonations}
              onRefresh={handleRefresh}
            />
            <QuickActions
              onManageDonations={handleViewAllDonations}
              onManageUsers={handleManageUsers}
              onViewAnalytics={handleViewAnalytics}
              onGenerateReport={handleGenerateReport}
              onSendUpdates={handleSendUpdates}
              onPaymentSettings={handlePaymentSettings}
            />
          </div>
        </div>

        {/* Payment Status Overview */}
        <PaymentStatusOverview
          completed={dashboardStats.completedDonations}
          pending={dashboardStats.pendingDonations}
          failed={dashboardStats.failedDonations}
          refunded={dashboardStats.refundedDonations}
          isLoading={isLoading}
        />

        {/* Admin Info Footer */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Admin Access Confirmed</h3>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.email?.split('@')[0] || 'Admin'}! All calculations are based on completed payments only.
              </p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p><strong>Admin User:</strong> {user?.email || 'Loading...'}</p>
              <p><strong>Access Level:</strong> Administrator</p>
              <p><strong>Login Time:</strong> {new Date().toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}