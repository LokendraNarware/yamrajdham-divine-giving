import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

export default function SpiritualLeaderSection() {
  return (
    <section className="py-16 bg-gradient-peaceful relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-temple-peach/20 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-temple-gold/15 rounded-full opacity-15"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image */}
            <div className="relative">
              <div className="relative z-10">
                <div className="w-96 h-96 mx-auto lg:mx-0 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                  <img 
                    src="/mataji.png" 
                    alt="Mataji - Spiritual Leader" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Floating decorative elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-temple-gold rounded-full flex items-center justify-center shadow-lg">
          <Star className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-temple-brown rounded-full flex items-center justify-center shadow-lg">
          <Heart className="w-6 h-6 text-white" />
        </div>
            </div>

            {/* Right side - Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-temple-gold font-medium">Mataji's Divine Guidance</span>
                </div>
                
                <blockquote className="text-2xl md:text-3xl font-bold text-temple-charcoal leading-tight italic">
                  "Faith is not just devotion – it is service and awareness."
                </blockquote>
                
                <div className="w-20 h-1 bg-temple-gold rounded-full"></div>
                
                <p className="text-lg text-temple-grey leading-relaxed">
                  माताजी ने अपने जीवन को केवल भक्ति तक सीमित नहीं रखा, बल्कि जनकल्याण और आध्यात्मिक जागरूकता को भी अपना उद्देश्य बनाया।
                </p>
                
                <p className="text-lg text-temple-grey leading-relaxed">
                  Inspired by Mataji, the Yamraj Dham Trust was founded with a sacred mission:
                </p>
                
                <ul className="text-lg text-temple-grey leading-relaxed space-y-2 ml-4">
                  <li>• To protect Sanatan Dharma</li>
                  <li>• To serve humanity selflessly</li>
                  <li>• To create a Shaktipeeth and spiritual centers for all</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="brown"
                size="lg" 
                className="px-8 py-3 rounded-full font-semibold"
              >
                Learn More About Mataji
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-temple-gold text-temple-gold hover:bg-temple-cream px-8 py-3 rounded-full font-semibold"
              >
                Join Our Mission
              </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
