"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, HandHeart, Users, Gift, Star, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const AboutSevaSection = () => {
  const router = useRouter();
  const sevaOptions = [
    {
      icon: Heart,
      title: "Financial Donations",
      description: "Support temple construction with your generous contributions",
      highlight: "Every rupee counts"
    },
    {
      icon: HandHeart,
      title: "Volunteer Service",
      description: "Offer your time and skills to help with temple activities",
      highlight: "Seva is divine"
    },
    {
      icon: Users,
      title: "Community Outreach",
      description: "Help spread awareness and bring more devotees to our mission",
      highlight: "Spread the word"
    },
    {
      icon: Gift,
      title: "Material Donations",
      description: "Contribute construction materials, books, or other resources",
      highlight: "Every gift matters"
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            🙏 Seva & Contribution
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Every devotee can take part in this divine journey through donations, seva, or volunteering. Each contribution—big or small—helps in building this sacred abode.
          </p>
        </div>
        
        {/* Ways to Contribute */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sevaOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <Card key={index} className="h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {option.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    {option.description}
                  </p>
                  <div className="text-sm font-medium text-white/90 bg-white/10 rounded-full px-3 py-1">
                    {option.highlight}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Main CTA Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Join us in Seva – Contribute to Temple Construction
            </h3>
            <p className="text-lg text-white/90 mb-8 max-w-3xl mx-auto">
              Your contribution, no matter the size, becomes a sacred offering in the construction of this divine temple. Together, we build not just a structure, but a legacy of faith and service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl" 
                className="bg-white text-temple-gold hover:bg-white/90 px-8 py-4 text-lg font-semibold group cursor-pointer"
                onClick={() => router.push('/donate')}
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Donate Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="border-2 border-white text-white hover:bg-white hover:text-temple-gold px-8 py-4 text-lg font-semibold cursor-pointer"
                onClick={() => router.push('/about')}
              >
                Learn About Seva
              </Button>
            </div>
          </div>
        </div>
        
        {/* Impact Statement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-white/90">Transparent Use of Funds</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/90">Divine Blessings</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">∞</div>
            <div className="text-white/90">Spiritual Impact</div>
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-4xl mx-auto">
            <blockquote className="text-xl font-medium text-white italic mb-4">
              "Contributing to the Yamrajdham Temple construction has been the most fulfilling experience of my life. Every donation feels like a sacred offering to the divine."
            </blockquote>
            <cite className="text-white/80">— A Devoted Supporter</cite>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSevaSection;
