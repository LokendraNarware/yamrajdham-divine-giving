import { Button } from "@/components/ui/button";
import { Heart, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-divine rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-divine bg-clip-text text-transparent">
              Yamrajdham
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-foreground hover:text-primary transition-colors">
            Home
          </a>
          <a href="#about" className="text-foreground hover:text-primary transition-colors">
            About
          </a>
          <a href="#donate" className="text-foreground hover:text-primary transition-colors">
            Donate
          </a>
          <a href="#progress" className="text-foreground hover:text-primary transition-colors">
            Progress
          </a>
          <a href="#prayers" className="text-foreground hover:text-primary transition-colors">
            Prayers
          </a>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="divine" size="sm" onClick={() => navigate("/donate")}>
            <Heart className="w-4 h-4" />
            Donate Now
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;