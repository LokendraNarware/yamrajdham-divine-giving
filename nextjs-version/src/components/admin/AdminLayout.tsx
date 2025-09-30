"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2 } from "lucide-react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      if (!user) {
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

        if (error || !adminData) {
          console.log('User is not an admin:', error);
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges to access this page.",
            variant: "destructive",
          });
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);
        setCheckingAuth(false);
      } catch (error) {
        console.error('Error checking admin auth:', error);
        toast({
          title: "Error",
          description: "Failed to verify admin access.",
          variant: "destructive",
        });
        router.push('/dashboard');
      }
    };

    checkAdminAuth();
  }, [user, router, toast]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium text-red-600">Access Denied</p>
          <p className="text-gray-600">You don&apos;t have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <AdminHeader 
        onToggleSidebar={toggleSidebar}
        onSignOut={handleSignOut}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPath={pathname}
        />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        }`}>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
