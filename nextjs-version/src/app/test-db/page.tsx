'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestDbPage() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Check Supabase connection
      console.log('Testing Supabase connection...');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      results.connection = {
        success: !connectionError,
        error: connectionError?.message,
        data: connectionTest
      };

      // Test 2: Check if user is authenticated
      results.auth = {
        user: user ? {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at
        } : null
      };

      // Test 3: Try to fetch user profile
      if (user) {
        console.log('Testing user profile fetch...');
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        results.userProfile = {
          success: !profileError,
          error: profileError?.message,
          data: profileData
        };
      }

      // Test 4: Try to fetch user donations
      if (user) {
        console.log('Testing user donations fetch...');
        const { data: donationsData, error: donationsError } = await supabase
          .from('user_donations')
          .select('*')
          .eq('user_id', user.id);
        
        results.userDonations = {
          success: !donationsError,
          error: donationsError?.message,
          data: donationsData,
          count: donationsData?.length || 0
        };
      }

      // Test 5: Check all users (for debugging)
      console.log('Testing all users fetch...');
      const { data: allUsers, error: allUsersError } = await supabase
        .from('users')
        .select('id, email, name, created_at')
        .limit(5);
      
      results.allUsers = {
        success: !allUsersError,
        error: allUsersError?.message,
        data: allUsers,
        count: allUsers?.length || 0
      };

      // Test 6: Check all donations (for debugging)
      console.log('Testing all donations fetch...');
      const { data: allDonations, error: allDonationsError } = await supabase
        .from('user_donations')
        .select('id, user_id, amount, payment_status, created_at')
        .limit(5);
      
      results.allDonations = {
        success: !allDonationsError,
        error: allDonationsError?.message,
        data: allDonations,
        count: allDonations?.length || 0
      };

    } catch (error) {
      results.generalError = error;
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, [user]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
            <CardDescription>
              Testing Supabase connection and data access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runTests} disabled={loading}>
              {loading ? 'Running Tests...' : 'Run Tests Again'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {Object.entries(testResults).map(([key, result]: [string, any]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-lg capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
