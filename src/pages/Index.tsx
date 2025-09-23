import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DonationSection from "@/components/DonationSection";
import ProgressTracker from "@/components/ProgressTracker";
import PrayerSection from "@/components/PrayerSection";
import SupabaseTest from "@/components/SupabaseTest";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Phone, Mail, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        
        {/* Temporary Supabase Test - Remove after testing */}
        <section className="py-8 bg-muted/50">
          <div className="container px-4">
            <SupabaseTest />
          </div>
        </section>
        
        <DonationSection />
        <ProgressTracker />
        <PrayerSection />
        
        {/* About Section */}
        <section id="about" className="py-16 bg-background">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About Yamrajdham Temple
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Yamrajdham Temple is being built as a sacred space for spiritual growth, community 
                gathering, and divine worship. Our vision is to create a beautiful traditional temple 
                that honors ancient architectural principles while serving the spiritual needs of 
                devotees for generations to come.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-divine rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Spiritual Growth</h3>
                    <p className="text-sm text-muted-foreground">
                      A center for meditation, prayer, and spiritual learning
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-divine rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Community Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Educational programs and charitable activities for all
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-divine rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Cultural Heritage</h3>
                    <p className="text-sm text-muted-foreground">
                      Preserving and sharing ancient wisdom and traditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-divine rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Yamrajdham</span>
              </div>
              <p className="text-sm opacity-80">
                Building a sacred temple for spiritual growth and community worship.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#home" className="block opacity-80 hover:opacity-100 transition-opacity">Home</a>
                <a href="#about" className="block opacity-80 hover:opacity-100 transition-opacity">About</a>
                <a href="#donate" className="block opacity-80 hover:opacity-100 transition-opacity">Donate</a>
                <a href="#progress" className="block opacity-80 hover:opacity-100 transition-opacity">Progress</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm">
                <div className="opacity-80">Daily Worship</div>
                <div className="opacity-80">Prayer Requests</div>
                <div className="opacity-80">Special Ceremonies</div>
                <div className="opacity-80">Educational Programs</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 opacity-80">
                  <Phone className="w-4 h-4" />
                  +91 98765 43210
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <Mail className="w-4 h-4" />
                  info@yamrajdham.org
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <MapPin className="w-4 h-4" />
                  Temple Grounds, Sacred City
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2024 Yamrajdham Temple. All rights reserved. Built with devotion and dedication.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
