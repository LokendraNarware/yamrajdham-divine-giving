import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DonationSection from "@/components/DonationSection";
import ProgressTracker from "@/components/ProgressTracker";
import PrayerSection from "@/components/PrayerSection";
import SpiritualLeaderSection from "@/components/SpiritualLeaderSection";
import YamrajDhamSection from "@/components/YamrajDhamSection";
import MissionVisionSection from "@/components/MissionVisionSection";
import CommunitySection from "@/components/CommunitySection";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Phone, Mail, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        <HeroSection />
        
        {/* Spiritual Leader Section */}
        <SpiritualLeaderSection />
        
        {/* Yamraj Dham Section */}
        <YamrajDhamSection />
        
        {/* Mission & Vision Section */}
        <MissionVisionSection />
        
        <section id="donate" className="py-16">
          <DonationSection />
        </section>
        
        <section id="progress" className="py-16 bg-muted/30">
          <ProgressTracker />
        </section>
        
        {/* Community Section */}
        <CommunitySection />
        
        <section id="prayers" className="py-16">
          <PrayerSection />
        </section>
        
        {/* Closing Call to Action */}
        <section className="py-16 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-yellow-300 font-medium">💫 Closing Call</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Be a part of history. Be a part of dharma.
              </h2>
              <p className="text-lg leading-relaxed mb-8">
                Your support ensures that the Yamrajdham Temple, under the guidance of Dharam Dham Paavan Nagari Trust, becomes a beacon of faith, justice, and peace for generations to come.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors">
                  Donate Now
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-full font-semibold transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="px-4 py-2 bg-black rounded flex items-center justify-center">
                  <img 
                    src="/LOGO.png" 
                    alt="Yamrajdham Logo" 
                    className="h-8 object-contain"
                  />
                </div>
              </div>
              <p className="text-sm opacity-80">
                Building Yamrajdham Temple with devotion & dedication.
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
                <div className="opacity-80">Donate</div>
                <div className="opacity-80">Progress</div>
                <div className="opacity-80">Services</div>
                <div className="opacity-80">Contact</div>
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
            <p>&copy; 2024 Dharam Dham Paavan Nagari Trust – Building Yamrajdham Temple with devotion & dedication.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}