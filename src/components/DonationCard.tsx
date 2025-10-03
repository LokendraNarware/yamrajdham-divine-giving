"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface DonationCardProps {
  title: string;
  description: string;
  amount: string;
  icon: React.ReactNode;
  isPopular?: boolean;
}

const DonationCard = ({ title, description, amount, icon, isPopular }: DonationCardProps) => {
  const router = useRouter();

  const handleDonate = () => {
    router.push(`/donate?amount=${amount}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative hover:shadow-temple transition-all duration-300 ${
        isPopular ? 'border-primary shadow-gold' : ''
      }`}>
        {isPopular && (
          <motion.div 
            className="absolute -top-3 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-divine text-primary-foreground px-3 py-1 text-xs font-semibold rounded-full">
              Most Popular
            </span>
          </motion.div>
        )}
        
        <CardHeader className="text-center pb-4">
          <motion.div 
            className="mx-auto w-12 h-12 bg-gradient-peaceful rounded-full flex items-center justify-center mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {icon}
          </motion.div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <motion.div 
            className="text-3xl font-bold text-primary mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            ₹{amount}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant={isPopular ? "divine" : "temple"} 
              className="w-full"
              size="lg"
              onClick={handleDonate}
            >
              <Heart className="w-4 h-4" />
              Donate ₹{amount}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DonationCard;
