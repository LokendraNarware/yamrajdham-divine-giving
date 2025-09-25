'use client';

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestDataPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { user } = useAuth();

  const createTestUser = async () => {
    setLoading(true);
    try {
      const testUserData = {
        email: 'test@example.com',
        name: 'Test User',
        mobile: '9876543210',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pin_code: '123456',
        country: 'India',
        pan_no: 'ABCDE1234F'
      };

      const { data, error } = await supabase
        .from('users')
        .insert([testUserData])
        .select()
        .single();

      setResult({
        success: !error,
        error: error?.message,
        data: data
      });
    } catch (error) {
      setResult({
        success: false,
        error: error
      });
    }
    setLoading(false);
  };

  const createTestDonation = async () => {
    if (!user) {
      setResult({
        success: false,
        error: 'No authenticated user found'
      });
      return;
    }

    setLoading(true);
    try {
      const testDonationData = {
        user_id: user.id,
        amount: 1000,
        donation_type: 'general',
        payment_status: 'completed',
        payment_id: 'test_payment_123',
        payment_gateway: 'cashfree',
        dedication_message: 'Test donation for debugging',
        is_anonymous: false
      };

      const { data, error } = await supabase
        .from('user_donations')
        .insert([testDonationData])
        .select()
        .single();

      setResult({
        success: !error,
        error: error?.message,
        data: data
      });
    } catch (error) {
      setResult({
        success: false,
        error: error
      });
    }
    setLoading(false);
  };

  const createTestDonationForUser = async (userId: string) => {
    setLoading(true);
    try {
      const testDonationData = {
        user_id: userId,
        amount: Math.floor(Math.random() * 5000) + 500, // Random amount between 500-5500
        donation_type: 'general',
        payment_status: 'completed',
        payment_id: `test_payment_${Date.now()}`,
        payment_gateway: 'cashfree',
        dedication_message: `Test donation ${Date.now()}`,
        is_anonymous: false
      };

      const { data, error } = await supabase
        .from('user_donations')
        .insert([testDonationData])
        .select()
        .single();

      setResult({
        success: !error,
        error: error?.message,
        data: data
      });
    } catch (error) {
      setResult({
        success: false,
        error: error
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Data Creation</CardTitle>
            <CardDescription>
              Create test data for debugging the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button onClick={createTestUser} disabled={loading} className="w-full">
                Create Test User
              </Button>
            </div>
            
            {user && (
              <div>
                <Button onClick={createTestDonation} disabled={loading} className="w-full">
                  Create Test Donation (for current user)
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="userId">Create donation for specific user ID:</Label>
              <div className="flex gap-2">
                <Input
                  id="userId"
                  placeholder="Enter user ID"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const userId = (e.target as HTMLInputElement).value;
                      if (userId) createTestDonationForUser(userId);
                    }
                  }}
                />
                <Button 
                  onClick={() => {
                    const input = document.getElementById('userId') as HTMLInputElement;
                    if (input.value) createTestDonationForUser(input.value);
                  }}
                  disabled={loading}
                >
                  Create
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
