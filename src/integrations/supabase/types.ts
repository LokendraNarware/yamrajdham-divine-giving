export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          mobile: string
          address: string | null
          city: string | null
          state: string | null
          pin_code: string | null
          country: string | null
          pan_no: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          mobile: string
          address?: string | null
          city?: string | null
          state?: string | null
          pin_code?: string | null
          country?: string | null
          pan_no?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          mobile?: string
          address?: string | null
          city?: string | null
          state?: string | null
          pin_code?: string | null
          country?: string | null
          pan_no?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      admin: {
        Row: {
          id: string
          email: string
          name: string
          mobile: string
          role: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          mobile: string
          role?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          mobile?: string
          role?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_donations: {
        Row: {
          id: string
          user_id: string | null
          amount: number
          donation_type: string | null
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | null
          payment_id: string | null
          payment_gateway: string | null
          receipt_number: string | null
          is_anonymous: boolean | null
          dedication_message: string | null
          preacher_name: string | null
          cashfree_order_id: string | null
          created_at: string | null
          updated_at: string | null
          last_verified_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          amount: number
          donation_type?: string | null
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded' | null
          payment_id?: string | null
          payment_gateway?: string | null
          receipt_number?: string | null
          is_anonymous?: boolean | null
          dedication_message?: string | null
          preacher_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          amount?: number
          donation_type?: string | null
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded' | null
          payment_id?: string | null
          payment_gateway?: string | null
          receipt_number?: string | null
          is_anonymous?: boolean | null
          dedication_message?: string | null
          preacher_name?: string | null
          cashfree_order_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_verified_at?: string | null
        }
      }
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
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: 'upi' | 'card' | 'netbanking' | 'wallet' | 'other' | null
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
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: 'upi' | 'card' | 'netbanking' | 'wallet' | 'other' | null
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
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: 'upi' | 'card' | 'netbanking' | 'wallet' | 'other' | null
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
      donation_status: 'pending' | 'completed' | 'failed' | 'refunded'
      payment_method: 'upi' | 'card' | 'netbanking' | 'wallet' | 'other'
      prayer_type: 'general' | 'special' | 'havan' | 'group'
      prayer_status: 'submitted' | 'in_progress' | 'completed' | 'rejected'
      milestone_status: 'planned' | 'in_progress' | 'completed' | 'delayed'
      data_type: 'string' | 'number' | 'boolean' | 'json'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
