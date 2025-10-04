# Email Service Implementation Guide

## Overview

The email service has been successfully implemented to automatically send donation receipts with PDF attachments when donations are completed. This system includes:

- **Automatic Email Sending**: Emails are sent automatically when donations are completed via webhook
- **PDF Receipt Generation**: Server-side PDF generation using Puppeteer
- **Professional Email Templates**: HTML and text email templates with proper formatting
- **Admin Testing Interface**: Built-in testing tools for administrators

## Features Implemented

### 1. Email Service (`src/services/email.ts`)
- Nodemailer-based SMTP email service
- Professional HTML and text email templates
- PDF attachment support
- Error handling and logging
- Connection testing functionality

### 2. PDF Generation Service (`src/services/pdf-generator.ts`)
- Server-side PDF generation using Puppeteer
- Professional receipt design matching the existing receipt components
- QR code placeholder for verification
- Proper formatting and styling

### 3. Webhook Integration (`src/app/api/webhook/cashfree/route.ts`)
- Automatic email sending when donation status changes to 'completed'
- User information retrieval from database
- Error handling that doesn't break the webhook flow
- Comprehensive logging

### 4. Admin Testing Interface (`src/app/admin/email-test/page.tsx`)
- Email service connection testing
- Test email sending with custom data
- User-friendly interface for administrators
- Real-time feedback and error reporting

### 5. Test API Endpoint (`src/app/api/test-email/route.ts`)
- GET endpoint to test email service connection
- POST endpoint to send test emails
- Proper error handling and validation

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

### 2. Gmail Setup (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `SMTP_PASS`

### 3. Alternative Email Providers

You can use any SMTP provider. Common configurations:

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Custom SMTP:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Usage

### 1. Testing Email Service

1. Navigate to `/admin/email-test` in your application
2. Click "Test Email Connection" to verify SMTP settings
3. Fill in the test form with sample data
4. Click "Send Test Email" to send a sample receipt

### 2. Automatic Email Sending

Emails are automatically sent when:
- A donation payment is completed (status changes to 'completed')
- The webhook receives a `PAYMENT_SUCCESS_WEBHOOK` event
- The donor has a valid email address in the database

### 3. Email Content

Each email includes:
- **Subject**: "Donation Receipt - [Receipt Number] | Yamraj Dham Trust"
- **Professional HTML template** with trust branding
- **Text version** for email clients that don't support HTML
- **PDF attachment** with the complete donation receipt
- **Verification QR code** (placeholder for now)

## Email Template Features

### HTML Template
- Professional design with Yamraj Dham Trust branding
- Responsive layout that works on all devices
- Proper formatting for donation details
- Spiritual blessing message
- Contact information and trust details

### Text Template
- Plain text version for accessibility
- All essential information included
- Proper formatting for text-only email clients

### PDF Attachment
- Professional receipt design
- All donation details included
- QR code placeholder for verification
- Trust information and contact details
- Proper formatting for printing

## Error Handling

The system includes comprehensive error handling:

1. **Email Service Errors**: Logged but don't break the webhook flow
2. **PDF Generation Errors**: Fallback mechanisms in place
3. **Missing User Data**: Graceful handling when donor email is not available
4. **SMTP Connection Issues**: Proper error reporting and logging

## Logging

All email activities are logged with structured logging:
- Email sending attempts
- Success/failure status
- Error details
- Donor information (anonymized)
- Receipt details

## Security Considerations

1. **Environment Variables**: Never commit SMTP credentials to version control
2. **Email Validation**: Proper email format validation
3. **Rate Limiting**: Consider implementing rate limiting for email sending
4. **Spam Prevention**: Professional templates reduce spam likelihood

## Troubleshooting

### Common Issues

1. **"Email service not configured"**
   - Check that all SMTP environment variables are set
   - Verify SMTP credentials are correct

2. **"Authentication failed"**
   - For Gmail: Use App Password, not regular password
   - Check 2FA is enabled
   - Verify SMTP settings

3. **"Connection timeout"**
   - Check firewall settings
   - Verify SMTP host and port
   - Try different SMTP provider

4. **"PDF generation failed"**
   - Check Puppeteer installation
   - Verify server has enough memory
   - Check browser dependencies

### Testing Steps

1. Test email connection first
2. Send a test email with sample data
3. Check spam folder for test emails
4. Verify PDF attachment is included
5. Test with real donation data

## Future Enhancements

Potential improvements for the future:

1. **QR Code Integration**: Add actual QR code generation for verification
2. **Email Templates**: Multiple template options for different donation types
3. **Scheduled Emails**: Send reminder emails for incomplete donations
4. **Email Analytics**: Track email open rates and engagement
5. **Multi-language Support**: Templates in different languages
6. **Email Preferences**: Allow donors to opt-out of certain emails

## Support

For issues or questions:
1. Check the logs for detailed error messages
2. Use the admin testing interface to diagnose problems
3. Verify environment variable configuration
4. Test with different email providers if needed

The email service is now fully integrated and ready for production use!
