'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each user session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes by default
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Keep data in cache for 10 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            // Retry failed requests 2 times
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors (client errors)
              if (error instanceof Error && error.message.includes('4')) {
                return false;
              }
              return failureCount < 2;
            },
            // Don't refetch on window focus for dashboard data
            refetchOnWindowFocus: false,
            // Don't refetch on reconnect for dashboard data
            refetchOnReconnect: false,
            // Better error handling
            throwOnError: false,
          },
          mutations: {
            // Retry mutations once
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (error instanceof Error && error.message.includes('4')) {
                return false;
              }
              return failureCount < 1;
            },
            // Better error handling
            throwOnError: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
