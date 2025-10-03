// This file now only contains query keys and utilities
// QueryClient configuration is handled in QueryProvider.tsx

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
