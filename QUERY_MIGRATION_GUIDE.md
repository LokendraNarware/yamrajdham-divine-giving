# Query System Migration Guide

## Overview
This guide helps migrate existing components to use the new unified query system.

## Migration Steps

### 1. Replace Old Query Hooks

**Before (Old Pattern):**
```typescript
// Direct Supabase calls in components
const [users, setUsers] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchUsers();
}, []);
```

**After (New Pattern):**
```typescript
// Use unified query hooks
import { useAdminUsers } from '@/hooks/use-unified-queries';

const { data: users, isLoading, error } = useAdminUsers(page, limit);
```

### 2. Update Component Imports

**Replace these imports:**
```typescript
// OLD
import { useAdminStats } from '@/hooks/use-dashboard-data';
import { useEnhancedDashboard } from '@/hooks/use-enhanced-dashboard';

// NEW
import { 
  useAdminStats, 
  useEnhancedDashboard,
  useInvalidateAdminData 
} from '@/hooks/use-unified-queries';
```

### 3. Error Handling Migration

**Before:**
```typescript
const { data, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchData,
});

if (error) {
  console.error('Error:', error);
  return <div>Error occurred</div>;
}
```

**After:**
```typescript
const { data, error, isLoading } = useAdminStats();

// Error boundary will handle errors automatically
// Or use the error state for custom handling
if (error) {
  return <CustomErrorComponent error={error} />;
}
```

### 4. Cache Invalidation Migration

**Before:**
```typescript
const queryClient = useQueryClient();

const handleUpdate = async () => {
  await updateData();
  queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
};
```

**After:**
```typescript
import { useInvalidateAdminData } from '@/hooks/use-unified-queries';

const { invalidateAll } = useInvalidateAdminData();

const handleUpdate = async () => {
  await updateData();
  invalidateAll(); // Invalidates all admin queries
};
```

## Component Migration Examples

### Admin Dashboard Page
```typescript
// OLD: src/app/admin/page.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('user_donations')
          .select('amount, payment_status');
        
        if (error) throw error;
        setStats(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {/* Render stats */}
    </div>
  );
}
```

```typescript
// NEW: src/app/admin/page.tsx
import { useAdminStats } from '@/hooks/use-unified-queries';

export default function AdminPage() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading stats</div>;
  
  return (
    <div>
      {/* Render stats */}
    </div>
  );
}
```

### User Dashboard Page
```typescript
// OLD: src/app/dashboard/page.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function DashboardPage() {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchDonations = async () => {
        try {
          const { data, error } = await supabase
            .from('user_donations')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) throw error;
          setDonations(data);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchDonations();
    }
  }, [user]);

  // ... rest of component
}
```

```typescript
// NEW: src/app/dashboard/page.tsx
import { useUserDonations, useUserStats } from '@/hooks/use-unified-queries';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: donations, isLoading: donationsLoading } = useUserDonations(user?.id || '');
  const { data: stats, isLoading: statsLoading } = useUserStats(user?.id || '');

  const isLoading = donationsLoading || statsLoading;

  // ... rest of component
}
```

## Performance Improvements

### 1. Parallel Queries
```typescript
// OLD: Sequential loading
const stats = useAdminStats();
const analytics = useAdminAnalytics();
const donations = useAdminDonations();

// NEW: Use enhanced dashboard for parallel loading
const { stats, analytics, donations, isLoading } = useEnhancedDashboard();
```

### 2. Optimized Caching
```typescript
// OLD: Manual cache management
const queryClient = useQueryClient();
queryClient.setQueryData(['key'], newData);

// NEW: Automatic cache invalidation
const { invalidateStats } = useInvalidateAdminData();
invalidateStats(); // Automatically refetches fresh data
```

## Error Handling Improvements

### 1. Global Error Boundary
The new `QueryErrorBoundary` automatically catches and handles query errors:

```typescript
// In layout.tsx - already implemented
<QueryErrorBoundary>
  <ConditionalLayout>
    {children}
  </ConditionalLayout>
</QueryErrorBoundary>
```

### 2. Custom Error Components
```typescript
import { QueryErrorBoundary } from '@/components/providers/QueryErrorBoundary';

const CustomErrorFallback = ({ error, retry }) => (
  <div className="error-container">
    <h2>Custom Error Message</h2>
    <p>{error.message}</p>
    <button onClick={retry}>Retry</button>
  </div>
);

<QueryErrorBoundary fallback={CustomErrorFallback}>
  <YourComponent />
</QueryErrorBoundary>
```

## Testing Migration

### 1. Update Test Files
```typescript
// OLD: Mock Supabase directly
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: mockData, error: null }))
        }))
      }))
    }))
  }
}));

// NEW: Mock React Query hooks
jest.mock('@/hooks/use-unified-queries', () => ({
  useAdminStats: () => ({ data: mockStats, isLoading: false, error: null }),
  useAdminAnalytics: () => ({ data: mockAnalytics, isLoading: false, error: null }),
}));
```

### 2. Test Error Scenarios
```typescript
// Test error handling
jest.mock('@/hooks/use-unified-queries', () => ({
  useAdminStats: () => ({ 
    data: null, 
    isLoading: false, 
    error: new Error('Network error') 
  }),
}));
```

## Rollback Plan

If issues arise, you can temporarily rollback by:

1. **Revert imports** to old query hooks
2. **Keep error boundary** (it's safe and helpful)
3. **Gradually migrate** components one by one

## Benefits After Migration

1. **Consistent Error Handling**: All queries use the same error patterns
2. **Better Performance**: Optimized caching and parallel queries
3. **Easier Maintenance**: Centralized query logic
4. **Better UX**: Automatic retry logic and error boundaries
5. **Type Safety**: Better TypeScript support
6. **Debugging**: React Query DevTools integration

## Next Steps

1. **Start with admin pages** (they have the most complex queries)
2. **Test thoroughly** after each migration
3. **Update documentation** as you go
4. **Remove old query files** once migration is complete

---

*This migration will significantly improve your application's data fetching reliability and performance.*
