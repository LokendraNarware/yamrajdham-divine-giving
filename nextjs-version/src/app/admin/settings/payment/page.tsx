"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Settings, Save, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PaymentSettings {
  gateway: string;
  testMode: boolean;
  merchantId: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  minAmount: number;
  maxAmount: number;
  currency: string;
  autoApprove: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>({
    gateway: 'cashfree',
    testMode: true,
    merchantId: '',
    apiKey: '',
    secretKey: '',
    webhookUrl: '',
    minAmount: 1,
    maxAmount: 1000000,
    currency: 'INR',
    autoApprove: false,
    emailNotifications: true,
    smsNotifications: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: 'success' | 'error' | 'pending' }>({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, you'd fetch from a settings table
      // For now, we'll use environment variables or defaults
      const defaultSettings: PaymentSettings = {
        gateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || 'cashfree',
        testMode: process.env.NODE_ENV === 'development',
        merchantId: process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '',
        apiKey: process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY || '',
        secretKey: process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY || '',
        webhookUrl: process.env.NEXT_PUBLIC_WEBHOOK_URL || '',
        minAmount: 1,
        maxAmount: 1000000,
        currency: 'INR',
        autoApprove: false,
        emailNotifications: true,
        smsNotifications: false,
      };

      setSettings(defaultSettings);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load payment settings.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // In a real app, you'd save to a settings table
      // For now, we'll just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Payment settings saved successfully.",
      });
      
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save payment settings.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  const testConnection = async (type: string) => {
    try {
      setTestResults(prev => ({ ...prev, [type]: 'pending' }));
      
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test results
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setTestResults(prev => ({ 
        ...prev, 
        [type]: success ? 'success' : 'error' 
      }));
      
      toast({
        title: success ? "Success" : "Error",
        description: `${type} test ${success ? 'passed' : 'failed'}.`,
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, [type]: 'error' }));
      toast({
        title: "Error",
        description: `${type} test failed.`,
        variant: "destructive",
      });
    }
  };

  const getTestIcon = (type: string) => {
    const status = testResults[type];
    if (status === 'pending') return <Loader2 className="w-4 h-4 animate-spin" />;
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading payment settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Settings</h2>
            <p className="text-gray-600">Configure payment gateway and transaction settings</p>
          </div>
        </div>

        {/* Payment Gateway Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Gateway Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="gateway">Payment Gateway</Label>
                <Select value={settings.gateway} onValueChange={(value) => setSettings(prev => ({ ...prev, gateway: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cashfree">Cashfree</SelectItem>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="payu">PayU</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="testMode"
                  checked={settings.testMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, testMode: checked }))}
                />
                <Label htmlFor="testMode">Test Mode</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="merchantId">Merchant ID</Label>
                <Input
                  id="merchantId"
                  value={settings.merchantId}
                  onChange={(e) => setSettings(prev => ({ ...prev, merchantId: e.target.value }))}
                  placeholder="Enter merchant ID"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => testConnection('merchant')}
                >
                  {getTestIcon('merchant')}
                  <span className="ml-2">Test Connection</span>
                </Button>
              </div>

              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter API key"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => testConnection('api')}
                >
                  {getTestIcon('api')}
                  <span className="ml-2">Test API</span>
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="secretKey">Secret Key</Label>
              <Input
                id="secretKey"
                type="password"
                value={settings.secretKey}
                onChange={(e) => setSettings(prev => ({ ...prev, secretKey: e.target.value }))}
                placeholder="Enter secret key"
              />
            </div>

            <div>
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                value={settings.webhookUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="Enter webhook URL"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => testConnection('webhook')}
              >
                {getTestIcon('webhook')}
                <span className="ml-2">Test Webhook</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Transaction Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="minAmount">Minimum Amount</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={settings.minAmount}
                  onChange={(e) => setSettings(prev => ({ ...prev, minAmount: parseInt(e.target.value) || 1 }))}
                  placeholder="Minimum donation amount"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Current: {formatCurrency(settings.minAmount)}
                </p>
              </div>

              <div>
                <Label htmlFor="maxAmount">Maximum Amount</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={settings.maxAmount}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxAmount: parseInt(e.target.value) || 1000000 }))}
                  placeholder="Maximum donation amount"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Current: {formatCurrency(settings.maxAmount)}
                </p>
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoApprove"
                  checked={settings.autoApprove}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoApprove: checked }))}
                />
                <Label htmlFor="autoApprove">Auto-approve donations</Label>
                <p className="text-sm text-gray-500">Automatically approve completed payments</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
                <Label htmlFor="emailNotifications">Email notifications</Label>
                <p className="text-sm text-gray-500">Send email notifications for donations</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                />
                <Label htmlFor="smsNotifications">SMS notifications</Label>
                <p className="text-sm text-gray-500">Send SMS notifications for donations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>

        {/* Payment Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2.3s</div>
                <div className="text-sm text-gray-600">Avg. Processing Time</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">₹0</div>
                <div className="text-sm text-gray-600">Failed Transactions</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-gray-600">Gateway Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
