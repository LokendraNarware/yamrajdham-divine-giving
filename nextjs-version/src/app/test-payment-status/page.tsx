"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Donation {
  id: string;
  amount: number;
  payment_status: string;
  payment_id?: string;
  created_at: string;
  user_id: string;
}

export default function TestPaymentStatusPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching donations:', error);
      } else {
        setDonations(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDonationStatus = async (donationId: string, status: string) => {
    setUpdating(donationId);
    try {
      const response = await fetch('/api/payment/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId,
          status,
          paymentId: `test_payment_${Date.now()}`
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: `Donation status updated to ${status}`,
        });
        fetchDonations(); // Refresh the list
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header removed - using global layout */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
        {/* Header removed - using global layout */}
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Test Payment Status</h1>
              <p className="text-muted-foreground">
                Manually update donation payment statuses for testing
              </p>
            </div>
            <Button onClick={fetchDonations}>
              Refresh
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Donations ({donations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <div className="text-center py-8">
                  <p>No donations found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div key={donation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">₹{donation.amount.toLocaleString()}</h3>
                            {getStatusBadge(donation.payment_status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ID: {donation.id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created: {formatDate(donation.created_at)}
                          </p>
                          {donation.payment_id && (
                            <p className="text-xs text-muted-foreground">
                              Payment ID: {donation.payment_id}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDonationStatus(donation.id, 'completed')}
                            disabled={updating === donation.id || donation.payment_status === 'completed'}
                          >
                            {updating === donation.id ? 'Updating...' : 'Mark Completed'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDonationStatus(donation.id, 'failed')}
                            disabled={updating === donation.id || donation.payment_status === 'failed'}
                          >
                            {updating === donation.id ? 'Updating...' : 'Mark Failed'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDonationStatus(donation.id, 'pending')}
                            disabled={updating === donation.id || donation.payment_status === 'pending'}
                          >
                            {updating === donation.id ? 'Updating...' : 'Mark Pending'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
