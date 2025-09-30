import { Card, CardContent } from "@/components/ui/card";
import { Building, BookOpen, Users, Zap, Home, GraduationCap } from "lucide-react";

const AboutTempleConstructionSection = () => {
  const features = [
    {
      icon: Building,
      title: "Main Sanctum",
      description: "Sacred space housing the divine Yamraj idol with traditional Vedic architecture",
      color: "from-temple-peach to-temple-gold"
    },
    {
      icon: Zap,
      title: "Golden Kalash",
      description: "Magnificent golden dome adorning the temple, symbolizing divine blessings",
      color: "from-temple-gold to-temple-peach"
    },
    {
      icon: Home,
      title: "Dharamshala",
      description: "Comfortable accommodation facilities for devotees visiting the temple",
      color: "from-temple-cream to-temple-peach"
    },
    {
      icon: BookOpen,
      title: "Library & Education Center",
      description: "Sacred texts, spiritual books, and educational resources for learning",
      color: "from-temple-peach to-temple-gold"
    },
    {
      icon: Users,
      title: "Meditation Halls",
      description: "Peaceful spaces for meditation, prayer, and spiritual contemplation",
      color: "from-temple-gold to-temple-cream"
    },
    {
      icon: GraduationCap,
      title: "Worship Spaces",
      description: "Multiple prayer areas for different ceremonies and spiritual practices",
      color: "from-temple-cream to-temple-peach"
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-temple-charcoal">
            🛕 Temple Construction Features
          </h2>
          <div className="w-24 h-1 bg-gradient-divine mx-auto mb-8"></div>
          <p className="text-lg text-temple-grey max-w-3xl mx-auto">
            The Yamrajdham Temple will be a comprehensive spiritual complex designed to serve devotees and preserve our sacred traditions for generations to come.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow border border-border/30">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-temple-charcoal">
                    {feature.title}
                  </h3>
                  <p className="text-temple-grey leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Construction Progress */}
        <div className="bg-gradient-to-r from-temple-cream to-temple-peach rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-temple-charcoal mb-4">
              🏗️ Construction Progress
            </h3>
            <p className="text-temple-grey">
              We are committed to building this sacred space with the highest standards of craftsmanship and spiritual dedication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-temple-charcoal mb-2">Phase 1</div>
              <div className="text-temple-grey">Foundation & Main Structure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-temple-charcoal mb-2">Phase 2</div>
              <div className="text-temple-grey">Interior & Sanctum</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-temple-charcoal mb-2">Phase 3</div>
              <div className="text-temple-grey">Facilities & Amenities</div>
            </div>
          </div>
        </div>
        
        {/* Architectural Highlights */}
        <div className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-temple-charcoal">
                🏛️ Architectural Excellence
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-temple-grey">
                    <strong>Traditional Vedic Design:</strong> Following ancient architectural principles for spiritual harmony
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-temple-grey">
                    <strong>Modern Amenities:</strong> Contemporary facilities while preserving sacred traditions
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-temple-grey">
                    <strong>Eco-Friendly Construction:</strong> Sustainable materials and energy-efficient design
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-temple-grey">
                    <strong>Accessibility:</strong> Designed to welcome devotees of all abilities
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/construction-progress.jpg" 
                  alt="Temple Construction Progress" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-divine text-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">Sacred</div>
                  <div className="text-sm">Architecture</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTempleConstructionSection;
