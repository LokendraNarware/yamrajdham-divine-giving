// TypeScript types for Yamrajdham Temple Divine Giving Database Schema
// Generated to match the database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'other'
export type PrayerType = 'general' | 'special' | 'havan' | 'group'
export type PrayerStatus = 'submitted' | 'in_progress' | 'completed' | 'rejected'
export type MilestoneStatus = 'planned' | 'in_progress' | 'completed' | 'delayed'
export type DataType = 'string' | 'number' | 'boolean' | 'json'

export interface Database {
  public: {
    Tables: {
      donors: {
        Row: {
          id: string
          name: string
          email: string
          mobile: string
          country: string
          state: string
          city: string
          pin_code: string
          address: string
          pan_no: string | null
          preacher_name: string | null
          is_anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          mobile: string
          country?: string
          state: string
          city: string
          pin_code: string
          address: string
          pan_no?: string | null
          preacher_name?: string | null
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          mobile?: string
          country?: string
          state?: string
          city?: string
          pin_code?: string
          address?: string
          pan_no?: string | null
          preacher_name?: string | null
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      donation_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          suggested_amount: number | null
          icon: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          suggested_amount?: number | null
          icon?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          suggested_amount?: number | null
          icon?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          donor_id: string | null
          category_id: string | null
          amount: number
          custom_amount: number | null
          donation_type: string | null
          status: DonationStatus
          payment_method: PaymentMethod | null
          payment_id: string | null
          message: string | null
          is_anonymous: boolean
          receipt_number: string | null
          tax_deductible: boolean
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          donor_id?: string | null
          category_id?: string | null
          amount: number
          custom_amount?: number | null
          donation_type?: string | null
          status?: DonationStatus
          payment_method?: PaymentMethod | null
          payment_id?: string | null
          message?: string | null
          is_anonymous?: boolean
          receipt_number?: string | null
          tax_deductible?: boolean
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          donor_id?: string | null
          category_id?: string | null
          amount?: number
          custom_amount?: number | null
          donation_type?: string | null
          status?: DonationStatus
          payment_method?: PaymentMethod | null
          payment_id?: string | null
          message?: string | null
          is_anonymous?: boolean
          receipt_number?: string | null
          tax_deductible?: boolean
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      prayer_requests: {
        Row: {
          id: string
          donor_id: string | null
          name: string
          email: string
          prayer_type: PrayerType
          prayer_text: string
          amount: number
          status: PrayerStatus
          is_anonymous: boolean
          special_instructions: string | null
          scheduled_date: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          donor_id?: string | null
          name: string
          email: string
          prayer_type?: PrayerType
          prayer_text: string
          amount?: number
          status?: PrayerStatus
          is_anonymous?: boolean
          special_instructions?: string | null
          scheduled_date?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          donor_id?: string | null
          name?: string
          email?: string
          prayer_type?: PrayerType
          prayer_text?: string
          amount?: number
          status?: PrayerStatus
          is_anonymous?: boolean
          special_instructions?: string | null
          scheduled_date?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      construction_milestones: {
        Row: {
          id: string
          name: string
          description: string | null
          target_date: string | null
          completion_date: string | null
          status: MilestoneStatus
          progress_percentage: number
          estimated_cost: number | null
          actual_cost: number | null
          image_url: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          target_date?: string | null
          completion_date?: string | null
          status?: MilestoneStatus
          progress_percentage?: number
          estimated_cost?: number | null
          actual_cost?: number | null
          image_url?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          target_date?: string | null
          completion_date?: string | null
          status?: MilestoneStatus
          progress_percentage?: number
          estimated_cost?: number | null
          actual_cost?: number | null
          image_url?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      project_settings: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          data_type: DataType
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string | null
          data_type?: DataType
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
          data_type?: DataType
          created_at?: string
          updated_at?: string
        }
      }
      prayer_schedule: {
        Row: {
          id: string
          prayer_name: string
          time: string
          description: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          prayer_name: string
          time: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          prayer_name?: string
          time?: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      recent_prayers_display: {
        Row: {
          id: string
          prayer_text: string
          donor_name: string
          prayer_type: PrayerType
          is_featured: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          prayer_text: string
          donor_name?: string
          prayer_type?: PrayerType
          is_featured?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          prayer_text?: string
          donor_name?: string
          prayer_type?: PrayerType
          is_featured?: boolean
          display_order?: number
          created_at?: string
        }
      }
    }
    Views: {
      donation_summary: {
        Row: {
          category_name: string
          total_donations: number
          total_amount: number
          average_amount: number
          max_amount: number
          min_amount: number
        }
      }
      funding_progress: {
        Row: {
          total_goal: number
          current_amount: number
          total_donors: number
          total_donations: number
          average_donation: number
        }
      }
      recent_donations: {
        Row: {
          id: string
          amount: number
          created_at: string
          donor_name: string
          category_name: string | null
          message: string | null
        }
      }
    }
    Functions: {
      get_total_donations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_total_donors: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      update_funding_progress: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      donation_status: DonationStatus
      payment_method: PaymentMethod
      prayer_type: PrayerType
      prayer_status: PrayerStatus
      milestone_status: MilestoneStatus
      data_type: DataType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for forms and API
export type DonationFormData = {
  amount: string
  name: string
  email: string
  mobile: string
  country: string
  state: string
  city: string
  pinCode: string
  panNo?: string
  preacher?: string
  address: string
  message?: string
}

export type PrayerRequestFormData = {
  name: string
  email: string
  prayer: string
  type: PrayerType
}

export type DonationCategory = Database['public']['Tables']['donation_categories']['Row']
export type Donor = Database['public']['Tables']['donors']['Row']
export type Donation = Database['public']['Tables']['donations']['Row']
export type PrayerRequest = Database['public']['Tables']['prayer_requests']['Row']
export type ConstructionMilestone = Database['public']['Tables']['construction_milestones']['Row']
export type ProjectSetting = Database['public']['Tables']['project_settings']['Row']
export type PrayerSchedule = Database['public']['Tables']['prayer_schedule']['Row']
export type RecentPrayerDisplay = Database['public']['Tables']['recent_prayers_display']['Row']

// View types
export type DonationSummary = Database['public']['Views']['donation_summary']['Row']
export type FundingProgress = Database['public']['Views']['funding_progress']['Row']
export type RecentDonation = Database['public']['Views']['recent_donations']['Row']

// Insert types
export type DonorInsert = Database['public']['Tables']['donors']['Insert']
export type DonationInsert = Database['public']['Tables']['donations']['Insert']
export type PrayerRequestInsert = Database['public']['Tables']['prayer_requests']['Insert']
export type ConstructionMilestoneInsert = Database['public']['Tables']['construction_milestones']['Insert']

// Update types
export type DonorUpdate = Database['public']['Tables']['donors']['Update']
export type DonationUpdate = Database['public']['Tables']['donations']['Update']
export type PrayerRequestUpdate = Database['public']['Tables']['prayer_requests']['Update']
export type ConstructionMilestoneUpdate = Database['public']['Tables']['construction_milestones']['Update']
