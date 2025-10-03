"use client";

import HeroSection from "@/components/HeroSection";
import DonationSection from "@/components/DonationSection";
import ProgressTracker from "@/components/ProgressTracker";
import PrayerSection from "@/components/PrayerSection";
import SpiritualLeaderSection from "@/components/SpiritualLeaderSection";
import YamrajDhamSection from "@/components/YamrajDhamSection";
import MissionVisionSection from "@/components/MissionVisionSection";
import CommunitySection from "@/components/CommunitySection";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full">
        <section id="home">
          <HeroSection />
        </section>
        
        {/* Spiritual Leader Section */}
        <motion.section 
          id="about"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SpiritualLeaderSection />
        </motion.section>
        
        {/* Yamraj Dham Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <YamrajDhamSection />
        </motion.div>
        
        {/* Mission & Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <MissionVisionSection />
        </motion.div>
        
        <motion.section 
          id="donate" 
          className="py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <DonationSection />
        </motion.section>
        
        <motion.section 
          id="progress" 
          className="py-16 bg-muted/30"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <ProgressTracker />
        </motion.section>
        
        {/* Community Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <CommunitySection />
        </motion.div>
        
        <motion.section 
          id="prayers" 
          className="py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <PrayerSection />
        </motion.section>
        
        {/* Closing Call to Action */}
        <motion.section 
          className="py-16 bg-gradient-brown text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                🙏 Be a part of history. Be a part of dharma.
              </motion.h2>
              <motion.p 
                className="text-lg leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Your support ensures that the Yamrajdham Temple, under the guidance of <strong>DHARAM DHAM TRUST</strong>, becomes a beacon of faith, justice, and peace for generations to come.
              </motion.p>
              
              <motion.div 
                className="bg-white/10 rounded-lg p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
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
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.button 
                  onClick={() => router.push('/donate')}
                  className="bg-white text-temple-gold hover:bg-temple-cream px-8 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Donate Now
                </motion.button>
                <motion.button 
                  onClick={() => router.push('/contact')}
                  className="border-2 border-white text-white hover:bg-white hover:text-temple-gold px-8 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
    </div>
  );
}