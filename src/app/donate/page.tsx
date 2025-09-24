'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createPaymentSession, generateOrderId, formatAmount } from '@/services/cashfree';

export default function DonationFormPage() {
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.donorName || !formData.donorEmail || !formData.donorPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate unique order ID
      const orderId = generateOrderId('donation');
      
      const sessionData = {
        order_id: orderId,
        order_amount: parseFloat(formData.amount),
        order_currency: 'INR',
        customer_details: {
          customer_id: formData.donorEmail,
          customer_name: formData.donorName,
          customer_email: formData.donorEmail,
          customer_phone: formData.donorPhone,
        },
        order_meta: {
          return_url: `${window.location.origin}/donate/success?order_id=${orderId}`,
          notify_url: `${window.location.origin}/api/webhook/cashfree`,
          payment_methods: 'card,upi,netbanking,wallet',
        },
      };

      console.log('Creating payment session with SDK:', sessionData);
      
      toast({
        title: "Creating Payment Session",
        description: "Please wait while we set up your secure payment...",
      });
      
      const response = await createPaymentSession(sessionData);
      
      toast({
        title: "Payment Session Created",
        description: "Redirecting to Cashfree payment page...",
      });
      
      // Small delay to show the message, then redirect
      setTimeout(() => {
        window.location.href = response.payment_url;
      }, 1000);

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment session';
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block text-primary">
                Yamrajdham Temple
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Make a Donation</CardTitle>
              <CardDescription className="text-center">
                Support the construction of Yamrajdham Temple
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Donation Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorName">Full Name</Label>
                  <Input
                    id="donorName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorEmail">Email Address</Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.donorEmail}
                    onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorPhone">Phone Number</Label>
                  <Input
                    id="donorPhone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.donorPhone}
                    onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Leave a message or prayer"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Creating Payment Session...' : `Donate ${formatAmount(parseFloat(formData.amount) || 0)}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Test Information */}
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">🧪 Test Mode</CardTitle>
              <CardDescription className="text-blue-700">
                This is using Cashfree sandbox environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-blue-700">
                <div>• <strong>Test Card:</strong> 4111 1111 1111 1111</div>
                <div>• <strong>CVV:</strong> Any 3 digits (e.g., 123)</div>
                <div>• <strong>Expiry:</strong> Any future date (e.g., 12/25)</div>
                <div>• <strong>Test UPI:</strong> success@upi</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
