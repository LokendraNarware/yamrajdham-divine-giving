"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  DollarSign,
  Users,
  BarChart3,
  FileText,
  Shield,
  LogOut,
  Menu,
  X
} from "lucide-react";
import React, { useState } from "react";

interface AdminSidebarProps {
  onSignOut: () => void;
  userEmail?: string;
}

const AdminSidebar = ({ onSignOut, userEmail }: AdminSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Home,
      description: "Overview and statistics"
    },
    {
      title: "Donations",
      href: "/admin/donations",
      icon: DollarSign,
      description: "Manage donations"
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      description: "User management"
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      description: "Reports and insights"
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: FileText,
      description: "Generate reports"
    }
  ];


  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const renderNavSection = (title: string, items: any[], icon?: any) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-3 py-2">
        {icon && React.createElement(icon, { className: "w-4 h-4 text-temple-gold" })}
        <h3 className={cn(
          "text-xs font-semibold text-temple-charcoal uppercase tracking-wider",
          isCollapsed && "hidden"
        )}>
          {title}
        </h3>
      </div>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 px-3 py-2 h-auto text-left",
              isActive 
                ? "bg-temple-gold text-white hover:bg-temple-gold/90" 
                : "text-temple-charcoal hover:bg-temple-soft-peach",
              isCollapsed && "justify-center px-2"
            )}
            onClick={() => handleNavigation(item.href)}
            title={isCollapsed ? item.title : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs opacity-70 truncate">{item.description}</div>
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className={cn(
      "flex flex-col h-screen bg-temple-cream border-r border-temple-gold/20 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-temple-gold/20">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-temple-gold rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-temple-charcoal">Admin Panel</h2>
              <p className="text-xs text-temple-charcoal/70">Yamrajdham Temple</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-temple-soft-peach"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2 space-y-6">
        {renderNavSection("Main", navigationItems)}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-temple-gold/20 space-y-2">
        {!isCollapsed && (
          <div className="text-xs text-temple-charcoal/70 mb-2">
            <div className="font-medium">Admin User:</div>
            <div className="truncate">{userEmail}</div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={onSignOut}
          className={cn(
            "w-full justify-start gap-3 text-temple-charcoal hover:bg-red-50 hover:text-red-600",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;