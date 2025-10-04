import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/structured-logger';

export interface EmailSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: 'string' | 'boolean' | 'number';
  description: string | null;
  is_encrypted: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface EmailSettingsConfig {
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user: string;
  smtp_pass: string;
  email_from_name: string;
  email_from_address: string;
  email_reply_to: string;
  email_enabled: boolean;
  email_test_mode: boolean;
}

export class EmailSettingsService {
  /**
   * Get all email settings
   */
  static async getAllSettings(): Promise<{ success: boolean; data?: EmailSetting[]; error?: any }> {
    try {
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('is_active', true)
        .order('setting_key');

      if (error) {
        logger.error('Failed to fetch email settings', { error });
        return { success: false, error };
      }

      return { success: true, data: data || [] };
    } catch (err) {
      logger.error('Exception in getAllSettings', { error: err });
      return { success: false, error: err };
    }
  }

  /**
   * Get email settings as configuration object
   */
  static async getSettingsConfig(): Promise<{ success: boolean; data?: EmailSettingsConfig; error?: any }> {
    try {
      const { data, error } = await supabase
        .from('email_settings')
        .select('setting_key, setting_value, setting_type')
        .eq('is_active', true);

      if (error) {
        logger.error('Failed to fetch email settings config', { error });
        return { success: false, error };
      }

      // Convert settings array to configuration object
      const config: Partial<EmailSettingsConfig> = {};
      
      data?.forEach(setting => {
        const key = setting.setting_key as keyof EmailSettingsConfig;
        let value: any = setting.setting_value;

        // Convert based on type
        switch (setting.setting_type) {
          case 'boolean':
            value = value === 'true';
            break;
          case 'number':
            value = parseInt(value || '0');
            break;
          default:
            value = value || '';
        }

        config[key] = value;
      });

      return { success: true, data: config as EmailSettingsConfig };
    } catch (err) {
      logger.error('Exception in getSettingsConfig', { error: err });
      return { success: false, error: err };
    }
  }

  /**
   * Update a single email setting
   */
  static async updateSetting(
    settingKey: string,
    settingValue: string,
    updatedBy?: string
  ): Promise<{ success: boolean; data?: EmailSetting; error?: any }> {
    try {
      const updateData: any = {
        setting_value: settingValue,
        updated_at: new Date().toISOString(),
      };

      if (updatedBy) {
        updateData.updated_by = updatedBy;
      }

      const { data, error } = await supabase
        .from('email_settings')
        .update(updateData)
        .eq('setting_key', settingKey)
        .eq('is_active', true)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update email setting', { 
          settingKey, 
          error 
        });
        return { success: false, error };
      }

      logger.info('Email setting updated', { 
        settingKey, 
        updatedBy 
      });

      return { success: true, data };
    } catch (err) {
      logger.error('Exception in updateSetting', { 
        settingKey, 
        error: err 
      });
      return { success: false, error: err };
    }
  }

  /**
   * Update multiple email settings
   */
  static async updateMultipleSettings(
    settings: Record<string, string>,
    updatedBy?: string
  ): Promise<{ success: boolean; data?: EmailSetting[]; error?: any }> {
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      }));

      const { data, error } = await supabase
        .from('email_settings')
        .upsert(updates, { 
          onConflict: 'setting_key',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        logger.error('Failed to update multiple email settings', { 
          settings: Object.keys(settings), 
          error 
        });
        return { success: false, error };
      }

      logger.info('Multiple email settings updated', { 
        settings: Object.keys(settings), 
        updatedBy 
      });

      return { success: true, data: data || [] };
    } catch (err) {
      logger.error('Exception in updateMultipleSettings', { 
        settings: Object.keys(settings), 
        error: err 
      });
      return { success: false, error: err };
    }
  }

  /**
   * Test email configuration
   */
  static async testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
    try {
      const configResult = await this.getSettingsConfig();
      
      if (!configResult.success || !configResult.data) {
        return { success: false, error: 'Failed to load email settings' };
      }

      const config = configResult.data;

      // Basic validation
      if (!config.email_enabled) {
        return { success: false, error: 'Email service is disabled' };
      }

      if (!config.smtp_host || !config.smtp_user || !config.smtp_pass) {
        return { success: false, error: 'Missing required SMTP configuration' };
      }

      // Test SMTP connection (this would be done by the email service)
      return { success: true };
    } catch (err) {
      logger.error('Exception in testEmailConfiguration', { error: err });
      return { success: false, error: 'Failed to test email configuration' };
    }
  }

  /**
   * Reset settings to defaults
   */
  static async resetToDefaults(updatedBy?: string): Promise<{ success: boolean; error?: any }> {
    try {
      const defaultSettings = {
        smtp_host: 'smtp.gmail.com',
        smtp_port: '587',
        smtp_secure: 'false',
        smtp_user: '',
        smtp_pass: '',
        email_from_name: 'Yamraj Dham Trust',
        email_from_address: 'noreply@yamrajdham.com',
        email_reply_to: 'support@yamrajdham.com',
        email_enabled: 'true',
        email_test_mode: 'false',
      };

      const result = await this.updateMultipleSettings(defaultSettings, updatedBy);
      
      if (result.success) {
        logger.info('Email settings reset to defaults', { updatedBy });
      }

      return result;
    } catch (err) {
      logger.error('Exception in resetToDefaults', { error: err });
      return { success: false, error: err };
    }
  }
}
