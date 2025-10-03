  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/react-query';

// Unified error handling
const handleQueryError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  throw new Error(error?.message || `Failed to ${context}`);
};

// Admin Dashboard Hooks - Standardized
export const useAdminStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch admin stats');
        }
        return response.json();
      } catch (error) {
        handleQueryError(error, 'fetch admin stats');
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.admin.analytics,
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        return response.json();
      } catch (error) {
        handleQueryError(error, 'fetch analytics data');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useAdminUsers = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: [...queryKeys.admin.users, page, limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            *,
            user_donations!inner(
              id,
              amount,
              payment_status
            )
          `)
          .eq('user_donations.payment_status', 'completed')
          .order('created_at', { ascending: false })
          .range((page - 1) * limit, page * limit - 1);

        if (error) throw error;
        return data || [];
      } catch (error) {
        handleQueryError(error, 'fetch admin users');
      }
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 8 * 60 * 1000, // 8 minutes
    retry: 2,
  });
};

export const useAdminDonations = (page = 1, limit = 50, filters = {}) => {
  return useQuery({
    queryKey: [...queryKeys.admin.donations, page, limit, filters],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_donations')
          .select(`
            *,
            users (
              id,
              name,
              email,
              mobile
            )
          `)
          .order('created_at', { ascending: false })
          .range((page - 1) * limit, page * limit - 1);

        if (error) throw error;
        return data || [];
      } catch (error) {
        handleQueryError(error, 'fetch admin donations');
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useRecentDonations = (limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.admin.recentDonations, limit],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/admin/recent-donations?limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recent donations');
        }
        return response.json();
      } catch (error) {
        handleQueryError(error, 'fetch recent donations');
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// User Dashboard Hooks - Standardized
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.profile(userId),
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        handleQueryError(error, 'fetch user profile');
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!userId,
    retry: 2,
  });
};

export const useUserDonations = (userId: string, limit = 50) => {
  return useQuery({
    queryKey: [...queryKeys.user.donations(userId), limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_donations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data || [];
      } catch (error) {
        handleQueryError(error, 'fetch user donations');
      }
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 8 * 60 * 1000, // 8 minutes
    enabled: !!userId,
    retry: 2,
  });
};

export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.stats(userId),
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_donations')
          .select('amount, payment_status')
          .eq('user_id', userId)
          .eq('payment_status', 'completed');

        if (error) throw error;
        
        const totalDonated = (data as any)?.reduce((sum: number, donation: any) => sum + donation.amount, 0) || 0;
        const totalDonations = data?.length || 0;
        
        return {
          totalDonated,
          totalDonations,
          averageDonation: totalDonations > 0 ? totalDonated / totalDonations : 0,
        };
      } catch (error) {
        handleQueryError(error, 'fetch user stats');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!userId,
    retry: 2,
  });
};

// Public Data Hooks - Standardized
export const useDonationCategories = () => {
  return useQuery({
    queryKey: queryKeys.public.donationCategories,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('donation_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;
        return data || [];
      } catch (error) {
        handleQueryError(error, 'fetch donation categories');
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
};

export const useConstructionMilestones = () => {
  return useQuery({
    queryKey: queryKeys.public.constructionMilestones,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('construction_milestones')
          .select('*')
          .order('sort_order');

        if (error) throw error;
        return data || [];
      } catch (error) {
        handleQueryError(error, 'fetch construction milestones');
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

export const useProjectSettings = () => {
  return useQuery({
    queryKey: queryKeys.public.projectSettings,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('project_settings')
          .select('*');

        if (error) throw error;
        
        // Convert to key-value object
        const settings = ((data as any) || []).reduce((acc: any, setting: any) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as Record<string, string>);

        return settings;
      } catch (error) {
        handleQueryError(error, 'fetch project settings');
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

// Enhanced Dashboard Hook - Optimized
export const useEnhancedDashboard = () => {
  const stats = useAdminStats();
  const analytics = useAdminAnalytics();
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

// Mutation Hooks - Standardized
export const useUpdateDonationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ donationId, status }: { donationId: string; status: string }) => {
      try {
        const { error } = await (supabase as any)
          .from('user_donations')
          .update({ payment_status: status })
          .eq('id', donationId);
        
        if (error) throw error;
        return { donationId, status };
      } catch (error) {
        handleQueryError(error, 'update donation status');
      }
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['public'] });
    },
    retry: 1,
  });
};

// Cache Invalidation Hooks - Standardized
export const useInvalidateAdminData = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateStats: () => queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }),
    invalidateAnalytics: () => queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] }),
    invalidateUsers: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
    invalidateDonations: () => queryClient.invalidateQueries({ queryKey: ['admin', 'donations'] }),
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  };
};

export const useInvalidateUserData = (userId: string) => {
  const queryClient = useQueryClient();
  
  return {
    invalidateProfile: () => queryClient.invalidateQueries({ queryKey: ['user', 'profile', userId] }),
    invalidateDonations: () => queryClient.invalidateQueries({ queryKey: ['user', 'donations', userId] }),
    invalidateStats: () => queryClient.invalidateQueries({ queryKey: ['user', 'stats', userId] }),
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  };
};

export const useInvalidatePublicData = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateCategories: () => queryClient.invalidateQueries({ queryKey: ['public', 'donation-categories'] }),
    invalidateMilestones: () => queryClient.invalidateQueries({ queryKey: ['public', 'construction-milestones'] }),
    invalidateSettings: () => queryClient.invalidateQueries({ queryKey: ['public', 'project-settings'] }),
    invalidateRecentDonations: () => queryClient.invalidateQueries({ queryKey: ['public', 'recent-donations'] }),
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['public'] }),
  };
};
