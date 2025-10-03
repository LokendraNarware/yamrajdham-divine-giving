import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized caching configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch on window focus for dashboard data
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect for dashboard data
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  // Admin dashboard queries
  admin: {
    stats: ['admin', 'stats'] as const,
    donations: ['admin', 'donations'] as const,
    users: ['admin', 'users'] as const,
    analytics: ['admin', 'analytics'] as const,
    reports: ['admin', 'reports'] as const,
    recentDonations: ['admin', 'recent-donations'] as const,
  },
  // User dashboard queries
  user: {
    profile: (userId: string) => ['user', 'profile', userId] as const,
    donations: (userId: string) => ['user', 'donations', userId] as const,
    stats: (userId: string) => ['user', 'stats', userId] as const,
  },
  // Public data queries
  public: {
    donationCategories: ['public', 'donation-categories'] as const,
    constructionMilestones: ['public', 'construction-milestones'] as const,
    projectSettings: ['public', 'project-settings'] as const,
    recentDonations: ['public', 'recent-donations'] as const,
  },
} as const;
