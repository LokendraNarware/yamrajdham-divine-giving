"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

export default function DebugDashboardPage() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDebugCheck = async () => {
    if (!user) {
      setDebugInfo({ error: 'No user logged in' });
      return;
    }

    setLoading(true);
    try {
      console.log('Running debug check for user:', user.id, user.email);

      // Check 1: User profile by ID
      const { data: profileById, error: profileByIdError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // Check 2: User profile by email
      const { data: profileByEmail, error: profileByEmailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      // Check 3: All users (for comparison)
      const { data: allUsers, error: allUsersError } = await supabase
        .from('users')
        .select('*')
        .limit(10);

      // Check 4: All donations
      const { data: allDonations, error: allDonationsError } = await supabase
        .from('user_donations')
        .select('*')
        .limit(10);

      // Check 5: Donations for this user (by auth ID)
      const { data: donationsByAuthId, error: donationsByAuthIdError } = await supabase
        .from('user_donations')
        .select('*')
        .eq('user_id', user.id);

      // Check 6: Donations for this user (by email profile ID)
      let donationsByEmailId = null;
      let donationsByEmailIdError = null;
      if (profileByEmail && !profileByEmailError) {
        const result = await supabase
          .from('user_donations')
          .select('*')
          .eq('user_id', profileByEmail.id);
        donationsByEmailId = result.data;
        donationsByEmailIdError = result.error;
      }

      const debugData = {
        authUser: {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata,
        },
        profileById: {
          data: profileById,
          error: profileByIdError,
        },
        profileByEmail: {
          data: profileByEmail,
          error: profileByEmailError,
        },
        allUsers: {
          data: allUsers,
          error: allUsersError,
          count: allUsers?.length || 0,
        },
        allDonations: {
          data: allDonations,
          error: allDonationsError,
          count: allDonations?.length || 0,
        },
        donationsByAuthId: {
          data: donationsByAuthId,
          error: donationsByAuthIdError,
          count: donationsByAuthId?.length || 0,
        },
        donationsByEmailId: {
          data: donationsByEmailId,
          error: donationsByEmailIdError,
          count: donationsByEmailId?.length || 0,
        },
      };

      console.log('Debug data:', debugData);
      setDebugInfo(debugData);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      runDebugCheck();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Debug</h1>
              <p className="text-muted-foreground">
                Debug information for dashboard issues
              </p>
            </div>
            <Button onClick={runDebugCheck} disabled={loading}>
              {loading ? 'Running...' : 'Refresh Debug'}
            </Button>
          </div>

          {!user ? (
            <Card>
              <CardContent className="p-6">
                <p>Please log in to see debug information.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {/* Auth User Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Auth User Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo?.authUser, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Profile by ID */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile by Auth ID</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo?.profileById, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Profile by Email */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile by Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo?.profileByEmail, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* All Users */}
              <Card>
                <CardHeader>
                  <CardTitle>All Users ({debugInfo?.allUsers?.count || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-60">
                    {JSON.stringify(debugInfo?.allUsers, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* All Donations */}
              <Card>
                <CardHeader>
                  <CardTitle>All Donations ({debugInfo?.allDonations?.count || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-60">
                    {JSON.stringify(debugInfo?.allDonations, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Donations by Auth ID */}
              <Card>
                <CardHeader>
                  <CardTitle>Donations by Auth ID ({debugInfo?.donationsByAuthId?.count || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo?.donationsByAuthId, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Donations by Email Profile ID */}
              <Card>
                <CardHeader>
                  <CardTitle>Donations by Email Profile ID ({debugInfo?.donationsByEmailId?.count || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo?.donationsByEmailId, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
