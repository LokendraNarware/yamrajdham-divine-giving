'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail, Save, RotateCcw, TestTube, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface EmailSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: 'string' | 'boolean' | 'number';
  description: string | null;
  is_encrypted: boolean;
  is_active: boolean;
}

interface EmailSettingsConfig {
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

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSetting[]>([]);
  const [config, setConfig] = useState<Partial<EmailSettingsConfig>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    error?: string;
    step?: string;
  } | null>(null);

  // Test email form data
  const [testEmailData, setTestEmailData] = useState({
    donorEmail: '',
    donorName: '',
    amount: '1000',
    donationId: 'TEST-' + Date.now(),
    receiptNumber: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/email-settings');
      const result = await response.json();

      if (result.success) {
        setSettings(result.data);
        
        // Convert settings to config object
        const configObj: Partial<EmailSettingsConfig> = {};
        result.data.forEach((setting: EmailSetting) => {
          const key = setting.setting_key as keyof EmailSettingsConfig;
          let value: any = setting.setting_value;

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

          configObj[key] = value;
        });
        
        setConfig(configObj);
      } else {
        toast.error('Failed to load email settings');
      }
    } catch (error) {
      toast.error('Error loading email settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: string, value: string | boolean | number) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsToUpdate: Record<string, string> = {};
      
      Object.entries(config).forEach(([key, value]) => {
        settingsToUpdate[key] = String(value);
      });

      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: settingsToUpdate,
          updatedBy: 'admin', // In real app, get from auth context
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Email settings saved successfully');
        await loadSettings(); // Reload to get updated data
      } else {
        toast.error(result.error || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Error saving email settings');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (!confirm('Are you sure you want to reset all email settings to defaults?')) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/email-settings?action=reset', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedBy: 'admin', // In real app, get from auth context
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Email settings reset to defaults');
        await loadSettings();
      } else {
        toast.error(result.error || 'Failed to reset settings');
      }
    } catch (error) {
      toast.error('Error resetting email settings');
    } finally {
      setIsSaving(false);
    }
  };

  const testConfiguration = async (sendTestEmail = false) => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const requestBody: any = {};
      
      if (sendTestEmail) {
        requestBody.testEmail = true;
        requestBody.testData = testEmailData;
      }

      const response = await fetch('/api/admin/email-settings/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      setTestResult(result);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Test failed');
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Test failed',
        error: 'Network error',
      });
      toast.error('Error testing email configuration');
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading email settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Settings
          </CardTitle>
          <CardDescription>
            Configure SMTP settings and email preferences for donation receipts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Email Service</h3>
              <p className="text-sm text-muted-foreground">
                Enable or disable the email service
              </p>
            </div>
            <Switch
              checked={config.email_enabled || false}
              onCheckedChange={(checked) => updateSetting('email_enabled', checked)}
            />
          </div>

          <Separator />

          {/* SMTP Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SMTP Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_host">SMTP Host</Label>
                <Input
                  id="smtp_host"
                  placeholder="smtp.gmail.com"
                  value={config.smtp_host || ''}
                  onChange={(e) => updateSetting('smtp_host', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_port">SMTP Port</Label>
                <Input
                  id="smtp_port"
                  type="number"
                  placeholder="587"
                  value={config.smtp_port || ''}
                  onChange={(e) => updateSetting('smtp_port', parseInt(e.target.value) || 587)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_user">SMTP Username</Label>
                <Input
                  id="smtp_user"
                  type="email"
                  placeholder="your_email@gmail.com"
                  value={config.smtp_user || ''}
                  onChange={(e) => updateSetting('smtp_user', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_pass">SMTP Password</Label>
                <Input
                  id="smtp_pass"
                  type="password"
                  placeholder="Your app password"
                  value={config.smtp_pass || ''}
                  onChange={(e) => updateSetting('smtp_pass', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="smtp_secure"
                checked={config.smtp_secure || false}
                onCheckedChange={(checked) => updateSetting('smtp_secure', checked)}
              />
              <Label htmlFor="smtp_secure">Use SSL/TLS</Label>
            </div>
          </div>

          <Separator />

          {/* Email Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Email Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email_from_name">From Name</Label>
                <Input
                  id="email_from_name"
                  placeholder="Yamraj Dham Trust"
                  value={config.email_from_name || ''}
                  onChange={(e) => updateSetting('email_from_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_from_address">From Email</Label>
                <Input
                  id="email_from_address"
                  type="email"
                  placeholder="noreply@yamrajdham.com"
                  value={config.email_from_address || ''}
                  onChange={(e) => updateSetting('email_from_address', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email_reply_to">Reply-To Email</Label>
                <Input
                  id="email_reply_to"
                  type="email"
                  placeholder="support@yamrajdham.com"
                  value={config.email_reply_to || ''}
                  onChange={(e) => updateSetting('email_reply_to', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="email_test_mode"
                checked={config.email_test_mode || false}
                onCheckedChange={(checked) => updateSetting('email_test_mode', checked)}
              />
              <Label htmlFor="email_test_mode">Test Mode (emails not sent)</Label>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={saveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>

            <Button variant="outline" onClick={resetToDefaults} disabled={isSaving}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>

            <Button variant="outline" onClick={() => testConfiguration(false)} disabled={isTesting}>
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Configuration
                </>
              )}
            </Button>
          </div>

          {/* Test Results */}
          {testResult && (
            <Alert className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                  <div className="font-medium">{testResult.message}</div>
                  {testResult.error && (
                    <div className="mt-1 text-sm opacity-75">
                      Error: {testResult.error}
                      {testResult.step && ` (Step: ${testResult.step})`}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Test Email Section */}
      <Card>
        <CardHeader>
          <CardTitle>Send Test Email</CardTitle>
          <CardDescription>
            Send a test donation receipt email to verify the configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test_donor_email">Test Email Address</Label>
              <Input
                id="test_donor_email"
                type="email"
                placeholder="test@example.com"
                value={testEmailData.donorEmail}
                onChange={(e) => setTestEmailData({ ...testEmailData, donorEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test_donor_name">Test Donor Name</Label>
              <Input
                id="test_donor_name"
                placeholder="Test User"
                value={testEmailData.donorName}
                onChange={(e) => setTestEmailData({ ...testEmailData, donorName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test_amount">Test Amount (₹)</Label>
              <Input
                id="test_amount"
                type="number"
                placeholder="1000"
                value={testEmailData.amount}
                onChange={(e) => setTestEmailData({ ...testEmailData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test_receipt_number">Test Receipt Number</Label>
              <Input
                id="test_receipt_number"
                placeholder="RCP-TEST-001"
                value={testEmailData.receiptNumber}
                onChange={(e) => setTestEmailData({ ...testEmailData, receiptNumber: e.target.value })}
              />
            </div>
          </div>

          <Button 
            onClick={() => testConfiguration(true)} 
            disabled={isTesting || !testEmailData.donorEmail || !testEmailData.donorName}
            className="w-full"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Test Email...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Test Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Gmail Setup (Recommended):</strong>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>Enable 2-Factor Authentication on your Gmail account</li>
                <li>Generate an App Password: Google Account → Security → 2-Step Verification → App passwords</li>
                <li>Use the App Password in the SMTP Password field</li>
              </ol>
            </div>
            <div>
              <strong>Other Email Providers:</strong>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Outlook:</strong> smtp-mail.outlook.com, Port 587</li>
                <li><strong>Yahoo:</strong> smtp.mail.yahoo.com, Port 587</li>
                <li><strong>Custom SMTP:</strong> Contact your hosting provider for settings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
