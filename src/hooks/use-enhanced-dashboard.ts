import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

// Enhanced dashboard hooks for the new design

export const useRecentDonations = (limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.admin.recentDonations, limit],
    queryFn: async () => {
      const response = await fetch(`/api/admin/recent-donations?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent donations');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: [...queryKeys.admin.analytics, 'enhanced'],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useEnhancedDashboard = () => {
  const stats = useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: async () => {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const analytics = useDashboardAnalytics();
  const recentDonations = useRecentDonations();

  return {
    stats: stats.data,
    analytics: analytics.data,
    recentDonations: recentDonations.data,
    isLoading: stats.isLoading || analytics.isLoading || recentDonations.isLoading,
    error: stats.error || analytics.error || recentDonations.error,
    refetch: () => {
      stats.refetch();
      analytics.refetch();
      recentDonations.refetch();
    }
  };
};
