"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const router = useRouter();

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
          .eq('email', user.email || '')
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
          name: user.email?.split('@')[0] || 'Admin',
          mobile: '9999999999', // Default mobile
          role: 'admin',
          is_active: true
        } as any);

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
      <div className="bg-gray-50 flex items-center justify-center py-20">
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
      <div className="bg-gray-50 flex items-center justify-center py-20">
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
      <div className="bg-gray-50 flex items-center justify-center py-20">
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
    <div className="bg-gray-50 min-h-screen">
      {/* Admin Panel Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
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
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <AdminSidebar onSignOut={handleSignOut} userEmail={user?.email} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}