import { supabase } from '@/integrations/supabase/client';

export interface UserData {
  email: string;
  name: string;
  mobile: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  country?: string;
  pan_no?: string;
}

export interface DonationData {
  amount: number;
  donation_type?: string;
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_id?: string;
  payment_gateway?: string;
  receipt_number?: string;
  is_anonymous?: boolean;
  dedication_message?: string;
  preacher_name?: string;
}

export interface AdminData {
  email: string;
  name: string;
  mobile: string;
  role?: string;
  is_active?: boolean;
}

// User Management Functions
export const createUser = async (userData: UserData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error in createUser:', err);
    return { success: false, error: err };
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }

    // Return success even if no user found (data will be null)
    return { success: true, data };
  } catch (err) {
    console.error('Error in getUserByEmail:', err);
    return { success: false, error: err };
  }
};

// Donation Management Functions
export const createDonation = async (donationData: DonationData, userId?: string) => {
  try {
    const donationWithUser = {
      ...donationData,
      user_id: userId || null,
    };

    const { data, error } = await supabase
      .from('user_donations')
      .insert([donationWithUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating donation:', error);
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error in createDonation:', err);
    return { success: false, error: err };
  }
};

export const getDonations = async () => {
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error in getDonations:', err);
    return { success: false, error: err };
  }
};

export const updateDonationPayment = async (id: string, paymentData: { payment_status: string; payment_id?: string }) => {
  try {
    const { data, error } = await supabase
      .from('user_donations')
      .update(paymentData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating donation payment:', error);
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error in updateDonationPayment:', err);
    return { success: false, error: err };
  }
};

// Admin Management Functions
export const createAdmin = async (adminData: AdminData) => {
  try {
    const { data, error } = await supabase
      .from('admin')
      .insert([adminData])
      .select()
      .single();

    if (error) {
      console.error('Error creating admin:', error);
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error in createAdmin:', err);
    return { success: false, error: err };
  }
};

export const getAdmins = async () => {
  try {
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error in getAdmins:', err);
    return { success: false, error: err };
  }
};
