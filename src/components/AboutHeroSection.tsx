import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users } from "lucide-react";

const AboutHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/temple-hero.jpg" 
          alt="Yamrajdham Temple" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-gradient-divine text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <img 
                src="/LOGO.png" 
                alt="Yamrajdham Temple Logo" 
                className="w-4 h-4 object-contain"
              />
              DHARAM DHAM TRUST
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-divine bg-clip-text text-transparent">
              About DHARAM DHAM TRUST
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            DHARAM DHAM TRUST is dedicated to building Yamrajdham Temple, a divine center of spirituality, faith, and service. Our mission is to create a sacred space where devotion, wisdom, and community come together for generations to come.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="divine" size="xl" className="group">
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Join Our Mission
            </Button>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border/50">
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-lg">
              <div className="w-10 h-10 bg-temple-peach rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-temple-charcoal">Sacred Location</div>
                <div className="text-sm text-temple-grey">Yamrajdham Temple Site</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-lg">
              <div className="w-10 h-10 bg-temple-peach rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-temple-charcoal">Devotees</div>
                <div className="text-sm text-temple-grey">Growing Community</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-lg">
              <div className="w-10 h-10 bg-temple-peach rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-temple-charcoal">Divine Purpose</div>
                <div className="text-sm text-temple-grey">Spiritual Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
