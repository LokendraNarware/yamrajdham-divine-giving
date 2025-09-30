import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Lightbulb } from "lucide-react";

const AboutMissionVisionSection = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-temple-charcoal">
            Our Mission & Vision
          </h2>
          <div className="w-24 h-1 bg-gradient-divine mx-auto mb-8"></div>
          <p className="text-lg text-temple-grey max-w-3xl mx-auto">
            Guided by divine purpose and driven by unwavering faith, we work towards creating a sacred space that serves humanity and preserves our spiritual heritage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission Section */}
          <Card className="h-full border-2 border-temple-peach/20 hover:border-temple-peach/40 transition-colors">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-temple-peach to-temple-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-temple-charcoal mb-2">
                  🕉️ Our Mission
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-temple-grey">
                    <strong>Construct the grand Yamrajdham Temple</strong> as a beacon of Sanatan Dharma
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-temple-grey">
                    <strong>Spread spiritual awareness</strong> and cultural values across communities
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-temple-grey">
                    <strong>Provide facilities</strong> like Dharamshala, library, and education center for devotees
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-temple-grey">
                    <strong>Promote seva, meditation,</strong> and spiritual learning for all
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Vision Section */}
          <Card className="h-full border-2 border-temple-gold/20 hover:border-temple-gold/40 transition-colors">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-temple-gold to-temple-peach rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-temple-charcoal mb-2">
                  🌟 Our Vision
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-temple-cream to-temple-peach rounded-lg p-4">
                  <p className="text-temple-charcoal font-medium">
                    We envision Dharam Dham Paavan Nagari as a divine city of faith—where devotees experience inner peace, learn spiritual wisdom, and contribute to building a stronger society rooted in dharma.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-temple-peach" />
                    <span className="text-temple-grey">A sanctuary of peace and spiritual growth</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-temple-gold" />
                    <span className="text-temple-grey">A center for learning ancient wisdom</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-temple-peach" />
                    <span className="text-temple-grey">A foundation for community service</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-temple-gold" />
                    <span className="text-temple-grey">A beacon of hope for future generations</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom Quote */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-temple-cream to-temple-peach rounded-lg p-8 max-w-4xl mx-auto">
            <blockquote className="text-xl font-medium text-temple-charcoal italic">
              "Together, we build not just a temple, but a legacy of faith, service, and spiritual enlightenment that will inspire countless souls for generations to come."
            </blockquote>
            <cite className="block mt-4 text-temple-grey">— Dharam Dham Paavan Nagari Trust</cite>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMissionVisionSection;
