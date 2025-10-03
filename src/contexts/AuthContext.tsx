'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { isUserAdmin } from '@/lib/admin-utils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, userData: { name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const getInitialSession = useCallback(async () => {
    try {
      console.log('Getting initial session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      console.log('Initial session:', session);
      setUser(session?.user ?? null);
      
      // Check admin status if user exists (cached for performance)
      if (session?.user?.email) {
        try {
          const adminStatus = await isUserAdmin(session.user.email);
          setIsAdmin(adminStatus);
        } catch (adminError) {
          console.error('Error checking admin status:', adminError);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error in getInitialSession:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const initializeAuth = async () => {
      if (!mounted) return;
      
      try {
        await getInitialSession();
        
        if (!mounted) return;

        // Listen for auth changes
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            console.log('Auth state changed:', event, session);
            setUser(session?.user ?? null);
            
            // Check admin status if user exists
            if (session?.user?.email) {
              const adminStatus = await isUserAdmin(session.user.email);
              setIsAdmin(adminStatus);
            } else {
              setIsAdmin(false);
            }
            
            setLoading(false);
          }
        );
        
        subscription = authSubscription;
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [getInitialSession]);

  const signUp = useCallback(async (email: string, password: string, userData: { name: string; phone?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
      }

      // Create user profile in our users table
      if (data.user) {
        console.log('Creating user profile for:', data.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: userData.name,
            mobile: userData.phone || '', // Use mobile column, not phone
            created_at: new Date().toISOString(),
          } as any)
          .select()
          .single();

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        } else {
          console.log('User profile created successfully:', profileData);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out unexpected error:', error);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
  }), [user, loading, isAdmin, signUp, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
