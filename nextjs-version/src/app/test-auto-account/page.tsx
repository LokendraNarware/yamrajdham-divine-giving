"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUser, getUserByEmail } from '@/services/donations';
import { useToast } from '@/hooks/use-toast';

export default function TestAutoAccountPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testAutoAccountCreation = async () => {
    if (!email || !name || !mobile) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Testing auto account creation for:', email);
      
      // Check if user already exists
      const userResult = await getUserByEmail(email);
      
      if (userResult.success && userResult.data) {
        console.log('User already exists:', userResult.data);
        toast({
          title: "User Found",
          description: `User ${userResult.data.email} already exists with ID: ${userResult.data.id}`,
        });
      } else {
        console.log('Creating new user account...');
        
        const userData = {
          email: email,
          name: name,
          mobile: mobile,
          country: 'India',
        };

        const createUserResult = await createUser(userData);
        if (createUserResult.success && createUserResult.data) {
          console.log('New user account created:', createUserResult.data);
          toast({
            title: "Account Created",
            description: `New account created for ${createUserResult.data.email} with ID: ${createUserResult.data.id}`,
          });
        } else {
          const errorMessage = createUserResult.error?.message || 'Failed to create user account';
          throw new Error(`Account creation failed: ${errorMessage}`);
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Auto Account Creation Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Auto Account Creation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="test@example.com" 
              />
            </div>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe" 
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile *</Label>
              <Input 
                id="mobile" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
                placeholder="9876543210" 
              />
            </div>
            <Button 
              onClick={testAutoAccountCreation} 
              disabled={loading || !email || !name || !mobile}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Auto Account Creation'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>1. Email Check:</strong> System checks if user exists by email</p>
            <p><strong>2. Auto Creation:</strong> If not found, creates new account automatically</p>
            <p><strong>3. Donation Link:</strong> Links donation to the user account</p>
            <p><strong>4. No Login Required:</strong> Users can donate without registration</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
