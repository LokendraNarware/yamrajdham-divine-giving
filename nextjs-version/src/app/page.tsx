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
    <div className="w-full">
        <section id="home">
          <HeroSection />
        </section>
        
        {/* Spiritual Leader Section */}
        <section id="about">
          <SpiritualLeaderSection />
        </section>
        
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
        <section className="py-16 bg-gradient-brown text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                🙏 Be a part of history. Be a part of dharma.
              </h2>
              <p className="text-lg leading-relaxed mb-8">
                Your support ensures that the Yamrajdham Temple, under the guidance of <strong>DHARAM DHAM TRUST</strong>, becomes a beacon of faith, justice, and peace for generations to come.
              </p>
              
              <div className="bg-white/10 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">📑 Trust Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Trust Name:</strong> DHARAM DHAM TRUST<br/>
                    <strong>Email:</strong> dharamdhamtrust@gmail.com<br/>
                    <strong>Phone:</strong> +91-84273-83381
                  </div>
                  <div>
                    <strong>Location:</strong> Taranagar Churu, Rajasthan<br/>
                    <strong>Registration:</strong> [Trust Registration No.]<br/>
                    <strong>Website:</strong> https://dharamdhamtrust.org
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-temple-gold hover:bg-temple-cream px-8 py-3 rounded-full font-semibold transition-colors">
                Donate Now
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-temple-gold px-8 py-3 rounded-full font-semibold transition-colors">
                Contact Us
              </button>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}