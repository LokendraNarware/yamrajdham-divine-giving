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
  cashfree_order_id?: string;
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
export const createUser = async (userData: UserData): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(userData as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error in createUser:', err);
    return { success: false, error: err };
  }
};

export const getUserByEmail = async (email: string): Promise<{ success: boolean; data?: any; error?: any }> => {
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

export const getUserById = async (userId: string): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    console.log('Fetching user by ID:', userId);
    
    // First, try to get the current auth user to get their email
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser || !authUser.email) {
      console.error('No auth user or email found');
      return { success: false, error: 'No authenticated user found' };
    }

    // Try to find user by email first (this seems to work better)
    console.log('Looking up user by email:', authUser.email);
    const { data: userByEmail, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle();

    if (emailError) {
      console.error('Error fetching user by email:', emailError);
      return { success: false, error: emailError };
    }

    if (userByEmail) {
      console.log('Found user by email:', (userByEmail as any).id);
      return { success: true, data: userByEmail };
    }

    // If no user found by email, try by ID as fallback
    console.log('No user found by email, trying by ID...');
    const { data: userById, error: idError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (idError) {
      console.error('Error fetching user by ID:', idError);
      return { success: false, error: idError };
    }

    if (userById) {
      console.log('Found user by ID:', (userById as any).id);
      return { success: true, data: userById };
    }

    // If no user found, create a new one
    console.log('No existing user found, creating new record...');
    const newUserData = {
      id: userId,
      email: authUser.email || '',
      name: authUser.user_metadata?.name || '',
      mobile: authUser.user_metadata?.phone || '',
      created_at: new Date().toISOString(),
    };

    const { data: newData, error: createError } = await supabase
      .from('users')
      .insert(newUserData as any)
      .select()
      .single();

    if (createError) {
      console.error('Error creating user from auth:', createError);
      return { success: false, error: createError };
    }

    console.log('Created new user:', (newData as any).id);
    return { success: true, data: newData };
  } catch (err) {
    console.error('Error in getUserById:', err);
    return { success: false, error: err };
  }
};

export const updateUser = async (userId: string, userData: Partial<UserData>): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    console.log('Updating user with ID:', userId, 'Data:', userData);
    
    // Get the current auth user to get their email
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser || !authUser.email) {
      console.error('No auth user or email found');
      return { success: false, error: 'No authenticated user found' };
    }

    // Try to find user by email first (this seems to work better)
    console.log('Looking up user by email for update:', authUser.email);
    const { data: existingUser, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle();

    if (emailError) {
      console.error('Error fetching user by email:', emailError);
      return { success: false, error: emailError };
    }

    if (existingUser) {
      console.log('Found existing user by email, updating data...');
      
      // Update the existing user's data using their database ID
      const { data: updatedUser, error: updateError } = await (supabase as any)
        .from('users')
        .update(userData)
        .eq('id', (existingUser as any).id) // Use the database ID, not the auth ID
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Error updating existing user:', updateError);
        return { success: false, error: updateError };
      }

      return { success: true, data: updatedUser };
    }

    // If no user found by email, try by ID as fallback
    console.log('No user found by email, trying by ID...');
    const { data: userById, error: idError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (idError) {
      console.error('Error fetching user by ID:', idError);
      return { success: false, error: idError };
    }

    if (userById) {
      console.log('Found user by ID, updating data...');
      
      // Update the existing user's data
      const { data: updatedUser, error: updateError } = await (supabase as any)
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Error updating user by ID:', updateError);
        return { success: false, error: updateError };
      }

      return { success: true, data: updatedUser };
    }

    // If no user found, create new one
    console.log('No existing user found, creating new record...');
    const newUserData = {
      id: userId,
      email: authUser.email || '',
      ...userData,
      created_at: new Date().toISOString(),
    };

    const { data: newData, error: createError } = await supabase
      .from('users')
      .insert(newUserData as any)
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return { success: false, error: createError };
    }

    console.log('Created new user:', (newData as any).id);
    return { success: true, data: newData };
  } catch (err) {
    console.error('Error in updateUser:', err);
    return { success: false, error: err };
  }
};

// Donation Management Functions
export const createDonation = async (donationData: DonationData, userId?: string): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    const donationWithUser = {
      ...donationData,
      user_id: userId || null,
    };

    const { data, error } = await supabase
      .from('user_donations')
      .insert(donationWithUser as any)
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

export const getDonations = async (): Promise<{ success: boolean; data?: any; error?: any }> => {
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

export const updateDonationPayment = async (id: string, paymentData: { payment_status: string; payment_id?: string; cashfree_order_id?: string }): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    const { data, error } = await (supabase as any)
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
export const createAdmin = async (adminData: AdminData): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('admin')
      .insert(adminData as any)
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

export const getAdmins = async (): Promise<{ success: boolean; data?: any; error?: any }> => {
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
