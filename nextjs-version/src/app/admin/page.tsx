"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertCircle, DollarSign, Users, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Hide global header and footer for admin pages
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      header { display: none !important; }
      footer { display: none !important; }
      main { padding-top: 0 !important; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Check admin authentication
  useEffect(() => {
    const checkAdminAuth = async () => {
      console.log('Checking admin auth for user:', user?.email);
      
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        // Check if user exists in admin table
        const { data: adminData, error } = await supabase
          .from('admin')
          .select('*')
          .eq('email', user.email)
          .eq('is_active', true)
          .single();

        console.log('Admin query result:', { adminData, error });

        if (error || !adminData) {
          console.log('User is not an admin:', error);
          setError(`Access Denied: ${error?.message || 'You are not an admin'}`);
          setCheckingAuth(false);
          return;
        }

        console.log('Admin access granted:', adminData);
        setIsAdmin(true);
        setCheckingAuth(false);
      } catch (error) {
        console.error('Error checking admin auth:', error);
        setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setCheckingAuth(false);
      }
    };

    checkAdminAuth();
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleCreateAdmin = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('admin')
        .insert({
          email: user.email,
          name: user.email.split('@')[0],
          mobile: '9999999999', // Default mobile
          role: 'admin',
          is_active: true
        });

      if (error) {
        toast({
          title: "Error",
          description: `Failed to create admin: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Admin account created! Please refresh the page.",
        });
        // Refresh the page
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create admin account.",
        variant: "destructive",
      });
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Verifying admin access...</p>
          <p className="text-sm text-gray-500 mt-2">User: {user?.email}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">
              User: {user?.email}
            </p>
            <div className="space-y-2">
              <Button 
                onClick={handleCreateAdmin}
                className="w-full"
                variant="outline"
              >
                Create Admin Account
              </Button>
              <Button 
                onClick={handleSignOut}
                className="w-full"
                variant="outline"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Not an Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">You don&apos;t have admin privileges.</p>
            <p className="text-sm text-gray-500">
              User: {user?.email}
            </p>
            <Button 
              onClick={handleSignOut}
              className="w-full"
              variant="outline"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Yamrajdham Temple Management</p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Welcome to the admin panel!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-gray-500">No donations yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹0</div>
                <p className="text-xs text-gray-500">No funds raised</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-gray-500">No users yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Active</div>
                <p className="text-xs text-gray-500">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => router.push('/admin/donations')}
                  >
                    <DollarSign className="w-4 h-4 mr-3" />
                    Manage Donations
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-3" />
                    Manage Users
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-3" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="w-4 h-4 mr-3" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admin Info */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Access Confirmed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You have successfully accessed the admin panel. Manage donations, users, and view analytics.
                </p>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Admin User:</strong> {user?.email}
                  </p>
                  <p className="text-sm text-green-800">
                    <strong>Access Level:</strong> Administrator
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}