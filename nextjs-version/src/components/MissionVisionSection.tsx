import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Users, BookOpen, Lightbulb, Target, Star } from "lucide-react";

export default function MissionVisionSection() {
  return (
    <section className="py-20 bg-gradient-gold text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Star className="w-8 h-8 text-temple-gold" />
              <span className="text-3xl font-bold">Our Mission & Vision</span>
            </div>
            <div className="w-24 h-1 bg-white rounded-full mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Mission Section */}
            <div className="space-y-8">
              {/* Mission Card */}
              <Card className="bg-white/15 backdrop-blur-sm border-white/30 shadow-2xl">
                <CardContent className="p-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-white/25 rounded-full flex items-center justify-center shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold">OUR MISSION</h3>
                  </div>
                  
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="text-xl leading-relaxed font-medium">
                      Mission – To create a divine space where faith meets service, inspiring inner transformation through dharma, devotion, and community.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Mission Features */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-white/15 backdrop-blur-sm border-white/30 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-lg">Spiritual Growth</h4>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/15 backdrop-blur-sm border-white/30 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-lg">Community Service</h4>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Vision Section */}
            <div className="space-y-8">
              {/* Vision Image */}
              <div className="relative flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 rounded-full overflow-hidden border-6 border-white shadow-2xl">
                    <img 
                      src="/mataji.png" 
                      alt="Mataji - Vision" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative elements around image */}
                  <div className="absolute -top-6 -right-6 w-16 h-16 bg-temple-gold rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-8 h-8 text-temple-brown" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <Card className="bg-white/15 backdrop-blur-sm border-white/30 shadow-2xl">
                <CardContent className="p-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-white/25 rounded-full flex items-center justify-center shadow-lg">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold">OUR VISION</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                      <p className="text-lg font-semibold mb-4">Vision –</p>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-white rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-lg">Expand spiritual awareness & Maa's darshan</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-white rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-lg">Serve children, women & the elderly through seva programs</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-white rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-lg">Promote purity, positivity, and satvik living</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-white rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-lg">Build Yamraj dham Temple as a center of worship, justice & spiritual growth</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Button 
              variant="outline"
              size="lg" 
              className="bg-white text-temple-brown hover:bg-temple-cream px-12 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Join Our Mission
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
