import { supabase } from "@/integrations/supabase/client";

// Simple in-memory cache for admin status
const adminCache = new Map<string, { status: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Check if a user is an admin by their email (with caching)
 * @param email - User's email address
 * @returns Promise<boolean> - True if user is an admin, false otherwise
 */
export async function isUserAdmin(email: string): Promise<boolean> {
  try {
    // Check cache first
    const cached = adminCache.get(email);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.status;
    }

    const { data: adminData, error } = await supabase
      .from('admin')
      .select('id, is_active')
      .eq('email', email)
      .eq('is_active', true)
      .maybeSingle();

    const isAdmin = !error && adminData !== null;
    
    // Cache the result
    adminCache.set(email, { status: isAdmin, timestamp: Date.now() });
    
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get admin user data by email
 * @param email - User's email address
 * @returns Promise<AdminData | null> - Admin data if found, null otherwise
 */
export async function getAdminUser(email: string) {
  try {
    const { data: adminData, error } = await supabase
      .from('admin')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !adminData) {
      return null;
    }

    return adminData;
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return null;
  }
}
