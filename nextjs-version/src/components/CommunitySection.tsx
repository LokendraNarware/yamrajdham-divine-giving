import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Calendar, Instagram, Facebook, Youtube } from "lucide-react";

export default function CommunitySection() {
  return (
    <section className="py-16 bg-gradient-peaceful relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-temple-peach/20 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-temple-gold/15 rounded-full opacity-15"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-temple-gold font-medium">Community & Spiritual Growth</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Yamraj dham Temple will serve as:
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Features */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <Card className="bg-white/95 backdrop-blur-sm border-temple-antique-gold/30 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-temple-cream rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-temple-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-temple-charcoal">A place for meditation, prayer & learning</h3>
                        <p className="text-temple-grey">Sacred spaces designed for spiritual practice and inner peace.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm border-temple-antique-gold/30 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-temple-cream rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-temple-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-temple-charcoal">A hub for community service & seva</h3>
                        <p className="text-temple-grey">Programs and activities that bring people together in service.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm border-temple-antique-gold/30 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-temple-cream rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-temple-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-temple-charcoal">A center for preserving Sanatan traditions</h3>
                        <p className="text-temple-grey">Keeping ancient wisdom alive for future generations.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm border-temple-antique-gold/30 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-temple-cream rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-temple-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-temple-charcoal">A home for daily worship & special ceremonies</h3>
                        <p className="text-temple-grey">Regular rituals and celebrations that strengthen community bonds.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right side - Social Media */}
            <div className="space-y-6">
              <Card className="bg-gradient-gold text-white">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">Follow us: @yamraj_dham</h3>
                    <div className="flex justify-center gap-6 text-sm opacity-90">
                      <span>10K+ Followers</span>
                      <span>500+ Posts</span>
                      <span>Daily Spiritual Content</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <Instagram className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm font-medium">Instagram</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <Facebook className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm font-medium">Facebook</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <Youtube className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm font-medium">YouTube</div>
                    </div>
                  </div>

                  <Button 
                    variant="outline"
                    size="lg" 
                    className="bg-white text-temple-gold hover:bg-temple-cream px-8 py-3 rounded-full font-semibold"
                  >
                    Follow Our Journey
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
