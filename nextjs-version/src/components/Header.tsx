"use client";

import { Button } from "@/components/ui/button";
import { Heart, Menu, User, LogOut, Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const router = useRouter();
  const { user, signOut, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-temple-gold/20 bg-temple-cream/95 backdrop-blur-md supports-[backdrop-filter]:bg-temple-cream/80 shadow-temple">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 max-w-7xl">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="px-4 py-3 bg-gradient-divine rounded-lg shadow-gold flex items-center justify-center">
            <img 
              src="/LOGO.png" 
              alt="Yamrajdham Temple Logo" 
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center space-x-8">
          <button 
            onClick={() => router.push('/')} 
            className="text-temple-charcoal hover:text-temple-peach transition-colors font-medium relative group py-2"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-temple-peach transition-all group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => router.push('/about')} 
            className="text-temple-charcoal hover:text-temple-peach transition-colors font-medium relative group py-2"
          >
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-temple-peach transition-all group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => router.push('/donate')} 
            className="text-temple-charcoal hover:text-temple-peach transition-colors font-medium relative group py-2"
          >
            Donate
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-temple-peach transition-all group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => router.push('/profile')} 
            className="text-temple-charcoal hover:text-temple-peach transition-colors font-medium relative group py-2"
          >
            Profile
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-temple-peach transition-all group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => router.push('/login')} 
            className="text-temple-charcoal hover:text-temple-peach transition-colors font-medium relative group py-2"
          >
            Login
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-temple-peach transition-all group-hover:w-full"></span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Button 
                variant="divine" 
                size="sm" 
                onClick={() => router.push("/donate")}
                className="hidden sm:flex items-center gap-2 shadow-temple hover:shadow-divine"
              >
                <Heart className="w-4 h-4" />
                Donate Now
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-temple-soft-peach">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">My Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-temple-cream border-temple-gold shadow-temple">
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="hover:bg-temple-soft-peach">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  {isAdmin ? (
                    <DropdownMenuItem onClick={() => router.push("/admin")} className="hover:bg-temple-soft-peach">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => router.push("/dashboard")} className="hover:bg-temple-soft-peach">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-temple-gold" />
                  <DropdownMenuItem onClick={handleSignOut} className="hover:bg-temple-soft-peach">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push("/login")}
                className="border-temple-gold text-temple-charcoal hover:bg-temple-soft-peach"
              >
                Sign In
              </Button>
              <Button 
                variant="divine" 
                size="sm" 
                onClick={() => router.push("/donate")}
                className="hidden sm:flex items-center gap-2 shadow-temple hover:shadow-divine"
              >
                <Heart className="w-4 h-4" />
                Donate Now
              </Button>
            </>
          )}
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-temple-soft-peach"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-temple-cream/98 backdrop-blur-md border-t border-temple-gold/20 shadow-temple">
          <div className="container px-4 py-4 space-y-3">
            <button 
              onClick={() => { router.push('/'); setIsMobileMenuOpen(false); }} 
              className="block w-full text-left text-temple-charcoal hover:text-temple-peach transition-colors font-medium py-2"
            >
              Home
            </button>
            <button 
              onClick={() => { router.push('/about'); setIsMobileMenuOpen(false); }} 
              className="block w-full text-left text-temple-charcoal hover:text-temple-peach transition-colors font-medium py-2"
            >
              About Us
            </button>
            <button 
              onClick={() => { router.push('/donate'); setIsMobileMenuOpen(false); }} 
              className="block w-full text-left text-temple-charcoal hover:text-temple-peach transition-colors font-medium py-2"
            >
              Donate
            </button>
            <button 
              onClick={() => { router.push('/profile'); setIsMobileMenuOpen(false); }} 
              className="block w-full text-left text-temple-charcoal hover:text-temple-peach transition-colors font-medium py-2"
            >
              Profile
            </button>
            <button 
              onClick={() => { router.push('/login'); setIsMobileMenuOpen(false); }} 
              className="block w-full text-left text-temple-charcoal hover:text-temple-peach transition-colors font-medium py-2"
            >
              Login
            </button>
            
            {/* Mobile Action Buttons */}
            <div className="pt-3 border-t border-temple-gold/20 space-y-2">
              {!user && (
                <Button 
                  variant="divine" 
                  size="sm" 
                  onClick={() => { router.push("/donate"); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 shadow-temple"
                >
                  <Heart className="w-4 h-4" />
                  Donate Now
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
