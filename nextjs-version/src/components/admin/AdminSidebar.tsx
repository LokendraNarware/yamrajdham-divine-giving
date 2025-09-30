"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  DollarSign, 
  Users, 
  BarChart3, 
  Settings, 
  FileText,
  X
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export default function AdminSidebar({ isOpen, onClose, currentPath }: AdminSidebarProps) {
  const router = useRouter();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      current: currentPath === '/admin',
    },
    {
      name: 'Donations',
      href: '/admin/donations',
      icon: DollarSign,
      current: currentPath === '/admin/donations',
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: currentPath === '/admin/users',
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: currentPath === '/admin/analytics',
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: FileText,
      current: currentPath === '/admin/reports',
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: currentPath === '/admin/settings',
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose(); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full bg-white shadow-lg border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        w-64 lg:w-16
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={item.current ? "default" : "ghost"}
                  className={`
                    w-full justify-start gap-3 h-12
                    ${item.current 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="lg:hidden">{item.name}</span>
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <p className="text-xs text-gray-500 hidden lg:block">Yamrajdham</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
