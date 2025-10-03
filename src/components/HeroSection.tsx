"use client";

import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/temple-hero.jpg" 
          alt="Yamrajdham Temple" 
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4">
        <div className="max-w-3xl">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-gradient-divine text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <Image 
                src="/LOGO.png" 
                alt="Yamrajdham Logo" 
                width={16}
                height={16}
                className="w-4 h-4 object-contain"
              />
              Yamrajdham Temple
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-divine bg-clip-text text-transparent">
              Yamrajdham Temple
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/90 mb-8 max-w-2xl leading-relaxed">
            🌸 Welcome to DHARAM DHAM TRUST
            <br />
            Building a divine center of spirituality, faith, and service where devotion, wisdom, and community come together for generations to come.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              variant="divine" 
              size="xl" 
              className="group"
              onClick={() => router.push('/donate')}
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Donate Now
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => router.push('/about')}
            >
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border/50">
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-lg">
              <div className="w-10 h-10 bg-temple-peach rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-temple-charcoal">📍 Location</div>
                <div className="text-sm text-temple-grey">DHARAM DHAM TRUST</div>
                <div className="text-sm text-temple-grey">Taranagar Churu, Rajasthan</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-lg">
              <div className="w-10 h-10 bg-temple-peach rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-temple-charcoal">👥 Community</div>
                <div className="text-sm text-temple-grey">Growing Devotee Family</div>
                <div className="text-sm text-temple-grey">dharamdhamtrust@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
