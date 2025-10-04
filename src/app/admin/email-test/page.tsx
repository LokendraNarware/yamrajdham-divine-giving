'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react';

export default function EmailTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    error?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    donorEmail: '',
    donorName: '',
    amount: '1000',
    donationId: '',
    receiptNumber: '',
  });

  const testEmailConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'GET',
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to test email connection',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!formData.donorEmail || !formData.donorName || !formData.donationId) {
      setTestResult({
        success: false,
        message: 'Please fill in all required fields',
      });
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Test
          </CardTitle>
          <CardDescription>
            Test the email service configuration and send sample donation receipts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Connection Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Email Service Status</h3>
            <Button
              onClick={testEmailConnection}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                'Test Email Connection'
              )}
            </Button>
          </div>

          {/* Test Email Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Send Test Donation Receipt</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="donorEmail">Donor Email *</Label>
                <Input
                  id="donorEmail"
                  type="email"
                  placeholder="donor@example.com"
                  value={formData.donorEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, donorEmail: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donorName">Donor Name *</Label>
                <Input
                  id="donorName"
                  placeholder="John Doe"
                  value={formData.donorName}
                  onChange={(e) =>
                    setFormData({ ...formData, donorName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donationId">Donation ID *</Label>
                <Input
                  id="donationId"
                  placeholder="DON-123456"
                  value={formData.donationId}
                  onChange={(e) =>
                    setFormData({ ...formData, donationId: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="receiptNumber">Receipt Number</Label>
                <Input
                  id="receiptNumber"
                  placeholder="RCP-123456 (optional)"
                  value={formData.receiptNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, receiptNumber: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              onClick={sendTestEmail}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Email...
                </>
              ) : (
                'Send Test Email'
              )}
            </Button>
          </div>

          {/* Results */}
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
                    <div className="mt-1 text-sm opacity-75">{testResult.error}</div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Configure SMTP settings in your environment variables</li>
              <li>Use Gmail with App Password for testing (recommended)</li>
              <li>Test the connection first before sending emails</li>
              <li>Check your email provider's spam folder for test emails</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
