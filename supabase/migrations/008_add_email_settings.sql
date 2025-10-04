-- Migration: Add email settings table
-- Description: Create table to store email service configuration

CREATE TABLE IF NOT EXISTS email_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- string, boolean, number
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_settings_key ON email_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_email_settings_active ON email_settings(is_active);

-- Insert default email settings
INSERT INTO email_settings (setting_key, setting_value, setting_type, description, is_encrypted) VALUES
('smtp_host', 'smtp.gmail.com', 'string', 'SMTP server hostname', false),
('smtp_port', '587', 'number', 'SMTP server port number', false),
('smtp_secure', 'false', 'boolean', 'Use SSL/TLS for SMTP connection', false),
('smtp_user', '', 'string', 'SMTP username/email address', false),
('smtp_pass', '', 'string', 'SMTP password/app password', true),
('email_from_name', 'Yamraj Dham Trust', 'string', 'Default sender name for emails', false),
('email_from_address', 'noreply@yamrajdham.com', 'string', 'Default sender email address', false),
('email_reply_to', 'support@yamrajdham.com', 'string', 'Reply-to email address', false),
('email_enabled', 'true', 'boolean', 'Enable/disable email service', false),
('email_test_mode', 'false', 'boolean', 'Enable test mode (emails not sent)', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_email_settings_updated_at
    BEFORE UPDATE ON email_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_email_settings_updated_at();

-- Add RLS policies
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view and modify email settings
CREATE POLICY "Admins can manage email settings" ON email_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin 
            WHERE admin.id = auth.uid() 
            AND admin.is_active = true
        )
    );

-- Policy: Allow service role to read settings (for email service)
CREATE POLICY "Service role can read email settings" ON email_settings
    FOR SELECT USING (auth.role() = 'service_role');
