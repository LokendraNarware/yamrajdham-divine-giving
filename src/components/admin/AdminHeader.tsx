"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, LogOut, Bell, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onSignOut: () => void;
  sidebarOpen: boolean;
}

export default function AdminHeader({ 
  onToggleSidebar, 
  onSignOut, 
  sidebarOpen 
}: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Menu button and title */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Yamrajdham Temple Management</p>
              </div>
            </div>
          </div>

          {/* Right side - Notifications and user menu */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User info and logout */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.email || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
