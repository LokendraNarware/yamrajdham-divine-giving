import { supabase } from '@/integrations/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('donations').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connection successful!');
    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection test error:', err);
    return { success: false, error: 'Connection failed' };
  }
};
