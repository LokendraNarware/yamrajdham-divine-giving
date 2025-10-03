import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

// Enhanced dashboard hooks for the new design

export const useRecentDonations = (limit = 10, startDate?: Date | null, endDate?: Date | null) => {
  return useQuery({
    queryKey: [...queryKeys.admin.recentDonations, limit, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      
      const response = await fetch(`/api/admin/recent-donations?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent donations');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardAnalytics = (startDate?: Date | null, endDate?: Date | null) => {
  return useQuery({
    queryKey: [...queryKeys.admin.analytics, 'enhanced', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      
      const response = await fetch(`/api/admin/analytics?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useEnhancedDashboard = (startDate?: Date | null, endDate?: Date | null) => {
  console.log('useEnhancedDashboard: Called with dates:', { startDate, endDate });
  
  const stats = useQuery({
    queryKey: [...queryKeys.admin.stats, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      
      console.log('useEnhancedDashboard: Making API call with params:', params.toString());
      const response = await fetch(`/api/admin/stats?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const analytics = useDashboardAnalytics(startDate, endDate);
  const recentDonations = useRecentDonations(10, startDate, endDate);

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
