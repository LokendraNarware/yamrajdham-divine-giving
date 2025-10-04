# Email Settings Database Integration

## Overview

The email service has been enhanced to store configuration settings in the database instead of environment variables. This provides a more flexible and user-friendly way to manage email settings through an admin interface.

## Features Implemented

### 1. Database Migration (`supabase/migrations/008_add_email_settings.sql`)
- **Email Settings Table**: Stores all email configuration in the database
- **Default Settings**: Pre-populated with sensible defaults
- **Security**: Row Level Security (RLS) policies for admin-only access
- **Encryption Support**: Password fields can be marked as encrypted
- **Audit Trail**: Tracks who created/updated settings

### 2. Email Settings Service (`src/services/email-settings.ts`)
- **Database Operations**: CRUD operations for email settings
- **Configuration Management**: Converts database settings to configuration objects
- **Type Safety**: TypeScript interfaces for all settings
- **Validation**: Built-in validation for email configuration
- **Reset Functionality**: Reset to defaults capability

### 3. Admin Settings Page (`src/app/admin/settings/page.tsx`)
- **User-Friendly Interface**: Clean, intuitive settings management
- **Real-Time Testing**: Test email configuration without leaving the page
- **Form Validation**: Client-side validation for all fields
- **Test Email Sending**: Send test emails with custom data
- **Status Indicators**: Visual feedback for all operations
- **Help Documentation**: Built-in setup instructions

### 4. API Endpoints
- **`/api/admin/email-settings`**: Full CRUD operations for settings
- **`/api/admin/email-settings/test`**: Test email configuration and send test emails
- **Security**: Admin-only access with proper authentication

### 5. Updated Email Service (`src/services/email.ts`)
- **Database Integration**: Loads settings from database instead of environment variables
- **Dynamic Configuration**: Settings are loaded when needed
- **Test Mode Support**: Can be disabled or put in test mode
- **Fallback Handling**: Graceful handling when settings are not available

## Database Schema

### Email Settings Table
```sql
CREATE TABLE email_settings (
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
```

### Default Settings
- `smtp_host`: SMTP server hostname (default: smtp.gmail.com)
- `smtp_port`: SMTP server port (default: 587)
- `smtp_secure`: Use SSL/TLS (default: false)
- `smtp_user`: SMTP username/email address
- `smtp_pass`: SMTP password/app password (encrypted)
- `email_from_name`: Default sender name (default: Yamraj Dham Trust)
- `email_from_address`: Default sender email (default: noreply@yamrajdham.com)
- `email_reply_to`: Reply-to email (default: support@yamrajdham.com)
- `email_enabled`: Enable/disable email service (default: true)
- `email_test_mode`: Test mode - emails not sent (default: false)

## Usage

### 1. Accessing Admin Settings
Navigate to `/admin/settings` to access the email settings interface.

### 2. Configuring Email Settings
1. **Enable Email Service**: Toggle the email service on/off
2. **SMTP Configuration**: Set up your SMTP server details
3. **Email Settings**: Configure sender information
4. **Test Mode**: Enable test mode to prevent actual emails from being sent

### 3. Testing Configuration
1. **Test Connection**: Click "Test Configuration" to verify SMTP settings
2. **Send Test Email**: Use the test email form to send a sample receipt
3. **View Results**: Check the status indicators for success/failure

### 4. Saving Settings
- Click "Save Settings" to persist changes to the database
- Use "Reset to Defaults" to restore original settings
- All changes are logged with timestamps and user information

## Security Features

### 1. Row Level Security (RLS)
- Only admin users can view and modify email settings
- Service role can read settings for email service operation
- Regular users cannot access email settings

### 2. Password Encryption
- SMTP passwords are marked as encrypted fields
- Sensitive data is protected in the database
- Audit trail tracks all changes

### 3. Input Validation
- Server-side validation for all settings
- Type checking for different setting types
- Sanitization of user inputs

## API Reference

### GET `/api/admin/email-settings`
Retrieve all email settings.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "setting_key": "smtp_host",
      "setting_value": "smtp.gmail.com",
      "setting_type": "string",
      "description": "SMTP server hostname",
      "is_encrypted": false,
      "is_active": true
    }
  ]
}
```

### POST `/api/admin/email-settings`
Update multiple email settings.

**Request:**
```json
{
  "settings": {
    "smtp_host": "smtp.gmail.com",
    "smtp_port": "587",
    "email_enabled": "true"
  },
  "updatedBy": "admin"
}
```

### PUT `/api/admin/email-settings`
Update a single email setting.

**Request:**
```json
{
  "settingKey": "smtp_host",
  "settingValue": "smtp.gmail.com",
  "updatedBy": "admin"
}
```

### DELETE `/api/admin/email-settings?action=reset`
Reset all settings to defaults.

**Request:**
```json
{
  "updatedBy": "admin"
}
```

### POST `/api/admin/email-settings/test`
Test email configuration and optionally send test email.

**Request:**
```json
{
  "testEmail": true,
  "testData": {
    "donorEmail": "test@example.com",
    "donorName": "Test User",
    "amount": "1000",
    "donationId": "TEST-001",
    "receiptNumber": "RCP-TEST-001"
  }
}
```

## Migration from Environment Variables

### Before (Environment Variables)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### After (Database Settings)
- Settings are stored in the `email_settings` table
- Managed through the admin interface at `/admin/settings`
- No need to modify environment variables
- Settings can be changed without redeploying the application

## Benefits

### 1. **User-Friendly Management**
- No need to modify environment variables
- Visual interface for all settings
- Real-time testing and validation

### 2. **Flexibility**
- Settings can be changed without code deployment
- Different settings for different environments
- Easy backup and restore of configurations

### 3. **Security**
- Encrypted storage for sensitive data
- Audit trail for all changes
- Role-based access control

### 4. **Reliability**
- Fallback mechanisms when settings are unavailable
- Test mode for safe testing
- Comprehensive error handling

## Troubleshooting

### Common Issues

1. **"Email service not configured"**
   - Check that email settings are saved in the database
   - Verify SMTP credentials are correct
   - Ensure email service is enabled

2. **"Failed to load settings from database"**
   - Check database connection
   - Verify RLS policies are correct
   - Ensure admin user has proper permissions

3. **"Test email failed"**
   - Use the test configuration feature first
   - Check SMTP server settings
   - Verify email addresses are valid

### Debugging Steps

1. **Check Database Settings**:
   ```sql
   SELECT * FROM email_settings WHERE is_active = true;
   ```

2. **Test API Endpoints**:
   - Use the admin interface test features
   - Check browser developer tools for API errors
   - Review server logs for detailed error messages

3. **Verify Permissions**:
   - Ensure user has admin role
   - Check RLS policies are working correctly
   - Verify authentication is working

## Future Enhancements

Potential improvements for the future:

1. **Multiple Email Providers**: Support for different SMTP providers
2. **Email Templates**: Customizable email templates
3. **Scheduled Emails**: Send emails at specific times
4. **Email Analytics**: Track email delivery and open rates
5. **Backup/Restore**: Export/import email settings
6. **Multi-language Support**: Settings interface in different languages

The email settings system is now fully integrated and ready for production use!
