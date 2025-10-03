import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './react-query';

// Cache invalidation utilities for real-time updates
export class CacheInvalidationService {
  private queryClient: ReturnType<typeof useQueryClient>;

  constructor(queryClient: ReturnType<typeof useQueryClient>) {
    this.queryClient = queryClient;
  }

  // Invalidate admin data when donations are updated
  invalidateAdminData() {
    this.queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    this.queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
    this.queryClient.invalidateQueries({ queryKey: ['admin', 'donations'] });
  }

  // Invalidate user data when user makes a donation
  invalidateUserData(userId: string) {
    this.queryClient.invalidateQueries({ queryKey: ['user', 'profile', userId] });
    this.queryClient.invalidateQueries({ queryKey: ['user', 'donations', userId] });
    this.queryClient.invalidateQueries({ queryKey: ['user', 'stats', userId] });
  }

  // Invalidate public data when settings change
  invalidatePublicData() {
    this.queryClient.invalidateQueries({ queryKey: ['public', 'recent-donations'] });
    this.queryClient.invalidateQueries({ queryKey: ['public', 'project-settings'] });
  }

  // Invalidate all dashboard data
  invalidateAllDashboardData() {
    this.queryClient.invalidateQueries({ queryKey: ['admin'] });
    this.queryClient.invalidateQueries({ queryKey: ['user'] });
    this.queryClient.invalidateQueries({ queryKey: ['public'] });
  }

  // Prefetch data for better UX
  async prefetchUserData(userId: string) {
    await Promise.all([
      this.queryClient.prefetchQuery({
        queryKey: ['user', 'profile', userId],
        queryFn: async () => {
          const { userApi } = await import('./dashboard-api');
          return userApi.getUserProfile(userId);
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
      }),
      this.queryClient.prefetchQuery({
        queryKey: ['user', 'donations', userId],
        queryFn: async () => {
          const { userApi } = await import('./dashboard-api');
          return userApi.getUserDonations(userId);
        },
        staleTime: 3 * 60 * 1000, // 3 minutes
      }),
    ]);
  }

  // Prefetch admin data
  async prefetchAdminData() {
    await Promise.all([
      this.queryClient.prefetchQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
          const { adminApi } = await import('./dashboard-api');
          return adminApi.getDashboardStats();
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
      }),
      this.queryClient.prefetchQuery({
        queryKey: ['admin', 'analytics'],
        queryFn: async () => {
          const { adminApi } = await import('./dashboard-api');
          return adminApi.getAnalyticsData();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      }),
    ]);
  }

  // Prefetch public data
  async prefetchPublicData() {
    const { publicApi } = await import('./dashboard-api');
    
    await Promise.all([
      this.queryClient.prefetchQuery({
        queryKey: ['public', 'donation-categories'],
        queryFn: publicApi.getDonationCategories,
        staleTime: 30 * 60 * 1000, // 30 minutes
      }),
      this.queryClient.prefetchQuery({
        queryKey: ['public', 'construction-milestones'],
        queryFn: publicApi.getConstructionMilestones,
        staleTime: 15 * 60 * 1000, // 15 minutes
      }),
      this.queryClient.prefetchQuery({
        queryKey: ['public', 'project-settings'],
        queryFn: publicApi.getProjectSettings,
        staleTime: 10 * 60 * 1000, // 10 minutes
      }),
    ]);
  }
}

// Hook to get cache invalidation service
export function useCacheInvalidation() {
  const queryClient = useQueryClient();
  return new CacheInvalidationService(queryClient);
}

// Automatic cache invalidation based on user actions
export function useAutoCacheInvalidation() {
  const cacheService = useCacheInvalidation();

  return {
    // Call this when a donation is completed
    onDonationCompleted: (userId: string) => {
      cacheService.invalidateAdminData();
      cacheService.invalidateUserData(userId);
      cacheService.invalidatePublicData();
    },

    // Call this when admin updates settings
    onSettingsUpdated: () => {
      cacheService.invalidatePublicData();
      cacheService.invalidateAdminData();
    },

    // Call this when user profile is updated
    onUserProfileUpdated: (userId: string) => {
      cacheService.invalidateUserData(userId);
    },

    // Call this when donation status changes
    onDonationStatusChanged: (userId: string) => {
      cacheService.invalidateAdminData();
      cacheService.invalidateUserData(userId);
    },
  };
}

// Cache warming utilities
export function useCacheWarming() {
  const cacheService = useCacheInvalidation();

  return {
    // Warm cache for user dashboard
    warmUserCache: async (userId: string) => {
      await cacheService.prefetchUserData(userId);
    },

    // Warm cache for admin dashboard
    warmAdminCache: async () => {
      await cacheService.prefetchAdminData();
    },

    // Warm cache for public pages
    warmPublicCache: async () => {
      // Use the existing prefetch methods instead of accessing private queryClient
      await cacheService.prefetchPublicData();
    },
  };
}
