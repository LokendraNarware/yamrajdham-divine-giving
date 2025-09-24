import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/temple-hero.jpg" 
          alt="Yamrajdham Temple" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4">
        <div className="max-w-3xl">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-gradient-divine text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <img 
                src="/LOGO.png" 
                alt="Yamrajdham Logo" 
                className="w-4 h-4 object-contain"
              />
              Sacred Temple Construction
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-divine bg-clip-text text-transparent">
              Yamrajdham
            </span>
            <br />
            <span className="text-foreground">Divine Temple</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Join us in building a sacred space of worship, peace, and spiritual awakening. 
            Your contribution will help create a temple that will serve devotees for generations to come.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button variant="divine" size="xl" className="group">
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Donate Now
            </Button>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-temple-earth rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Location</div>
                <div className="text-sm text-muted-foreground">Sacred Grounds</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-temple-earth rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Completion</div>
                <div className="text-sm text-muted-foreground">Mid 2025</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-temple-earth rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Community</div>
                <div className="text-sm text-muted-foreground">1,200+ Devotees</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
