import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, userApi, publicApi } from '../lib/dashboard-api';
import { queryKeys } from '../lib/react-query';
import { supabase } from '@/integrations/supabase/client';

// Admin Dashboard Hooks
export const useAdminStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: adminApi.getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes - admin data changes more frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.admin.analytics,
    queryFn: adminApi.getAnalyticsData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAdminUsers = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: [...queryKeys.admin.users, page, limit],
    queryFn: () => adminApi.getUsers(page, limit),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 8 * 60 * 1000, // 8 minutes
  });
};

export const useAdminDonations = (page = 1, limit = 50, filters = {}) => {
  return useQuery({
    queryKey: [...queryKeys.admin.donations, page, limit, filters],
    queryFn: () => adminApi.getDonations(page, limit, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User Dashboard Hooks
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.profile(userId),
    queryFn: () => userApi.getUserProfile(userId),
    staleTime: 10 * 60 * 1000, // 10 minutes - user profile rarely changes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!userId,
  });
};

export const useUserDonations = (userId: string, limit = 50) => {
  return useQuery({
    queryKey: [...queryKeys.user.donations(userId), limit],
    queryFn: () => userApi.getUserDonations(userId, limit),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 8 * 60 * 1000, // 8 minutes
    enabled: !!userId,
  });
};

export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.stats(userId),
    queryFn: () => userApi.getUserStats(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!userId,
  });
};

// Public Data Hooks (for homepage, donation page, etc.)
export const useDonationCategories = () => {
  return useQuery({
    queryKey: queryKeys.public.donationCategories,
    queryFn: publicApi.getDonationCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories rarely change
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useConstructionMilestones = () => {
  return useQuery({
    queryKey: queryKeys.public.constructionMilestones,
    queryFn: publicApi.getConstructionMilestones,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useProjectSettings = () => {
  return useQuery({
    queryKey: queryKeys.public.projectSettings,
    queryFn: publicApi.getProjectSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useRecentDonations = (limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.public.recentDonations, limit],
    queryFn: () => publicApi.getRecentDonations(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes - recent donations change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Cache Invalidation Hooks
export const useInvalidateAdminData = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateStats: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats }),
    invalidateAnalytics: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.analytics }),
    invalidateUsers: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.users }),
    invalidateDonations: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.donations }),
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  };
};

export const useInvalidateUserData = (userId: string) => {
  const queryClient = useQueryClient();
  
  return {
    invalidateProfile: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(userId) }),
    invalidateDonations: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.donations(userId) }),
    invalidateStats: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.stats(userId) }),
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  };
};

export const useInvalidatePublicData = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateCategories: () => queryClient.invalidateQueries({ queryKey: queryKeys.public.donationCategories }),
    invalidateMilestones: () => queryClient.invalidateQueries({ queryKey: queryKeys.public.constructionMilestones }),
    invalidateSettings: () => queryClient.invalidateQueries({ queryKey: queryKeys.public.projectSettings }),
    invalidateRecentDonations: () => queryClient.invalidateQueries({ queryKey: queryKeys.public.recentDonations }),
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['public'] }),
  };
};

// Mutation hooks for data updates
export const useUpdateDonationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ donationId, status }: { donationId: string; status: string }) => {
      const { error } = await (supabase as any)
        .from('user_donations')
        .update({ payment_status: status })
        .eq('id', donationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all admin and user data that might be affected
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['public'] });
    },
  });
};
