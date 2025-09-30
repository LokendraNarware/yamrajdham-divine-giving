import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a user is an admin by their email
 * @param email - User's email address
 * @returns Promise<boolean> - True if user is an admin, false otherwise
 */
export async function isUserAdmin(email: string): Promise<boolean> {
  try {
    const { data: adminData, error } = await supabase
      .from('admin')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !adminData) {
      return false;
    }

    return true;
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
