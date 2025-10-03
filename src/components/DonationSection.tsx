"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, Building, Flower, BookOpen, Users, Crown } from "lucide-react";
import DonationCard from "./DonationCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const DonationSection = () => {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("1101");
  const router = useRouter();

  const handleQuickDonate = () => {
    const amount = customAmount || selectedAmount;
    router.push(`/donate?amount=${amount}`);
  };

  const donationTypes = [
    {
      title: "₹101 – ईंट दान (Brick Seva)",
      description: "Offer sacred bricks that will form the walls of Yamrajdham Temple.",
      amount: "101",
      icon: <Building className="w-6 h-6 text-primary" />
    },
    {
      title: "₹501 – पत्थर दान (Stone Seva)",
      description: "Contribute carved stones for the temple's base and pathways.",
      amount: "501",
      icon: <Building className="w-6 h-6 text-primary" />
    },
    {
      title: "₹1101 – नींव दान (Foundation Seva – Most Popular)",
      description: "Help strengthen the foundation on which the divine temple rises.",
      amount: "1101",
      icon: <Building className="w-6 h-6 text-primary" />,
      isPopular: true
    },
    {
      title: "₹2501 – स्तंभ दान (Pillar Seva)",
      description: "Support the raising of strong temple pillars, symbols of dharma & stability.",
      amount: "2501",
      icon: <Building className="w-6 h-6 text-primary" />
    },
    {
      title: "₹5101 – छत एवं द्वार (Roof & Door Seva)",
      description: "Contribute towards beautifully carved doors and protective temple roofing.",
      amount: "5101",
      icon: <Building className="w-6 h-6 text-primary" />
    },
    {
      title: "₹11001 – स्वर्ण कलश दान (Golden Kalash Sponsorship)",
      description: "Sponsor the sacred Golden Kalash adorning the temple's dome.",
      amount: "11001",
      icon: <Crown className="w-6 h-6 text-primary" />
    },
    {
      title: "₹51001 – विशेष निर्माण दान (Maha Construction Seva)",
      description: "A grand offering for domes, sanctum, and completion of the temple.",
      amount: "51001",
      icon: <Heart className="w-6 h-6 text-primary" />
    }
  ];

  const quickAmounts = ["101", "501", "1101", "2501", "5101"];

  return (
    <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-temple-gold font-medium">Donate & Support</span>
            </motion.div>
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Every rupee builds a brick of devotion.
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Quick Donation Options:
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Donation */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Quick Donation
                </CardTitle>
                <CardDescription>
                  Choose an amount or enter your own
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "divine" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Amount</label>
                  <Input
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount("");
                    }}
                    type="number"
                  />
                </div>

        <Button variant="brown" size="lg" className="w-full" onClick={handleQuickDonate}>
          <Heart className="w-4 h-4" />
          Donate Today – Be Part of the Divine Journey
        </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Secure payment • Transparent fund usage
                </div>
              </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Donation Categories */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {donationTypes.map((donation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <DonationCard
                    title={donation.title}
                    description={donation.description}
                    amount={donation.amount}
                    icon={donation.icon}
                    isPopular={donation.isPopular}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Trust Information */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-3xl mx-auto bg-gradient-peaceful">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Trust Information</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Official receipts will be provided for all donations.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                  <span>• Transparent Fund Usage</span>
                  <span>• Regular Progress Updates</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
  );
};

export default DonationSection;
