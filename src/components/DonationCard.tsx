import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Target } from "lucide-react";

interface DonationCardProps {
  title: string;
  description: string;
  amount: string;
  icon: React.ReactNode;
  isPopular?: boolean;
}

const DonationCard = ({ title, description, amount, icon, isPopular }: DonationCardProps) => {
  return (
    <Card className={`relative hover:shadow-temple transition-all duration-300 hover:scale-105 ${
      isPopular ? 'border-primary shadow-gold' : ''
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-divine text-primary-foreground px-3 py-1 text-xs font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-gradient-peaceful rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center">
        <div className="text-3xl font-bold text-primary mb-4">₹{amount}</div>
        <Button 
          variant={isPopular ? "divine" : "temple"} 
          className="w-full"
          size="lg"
        >
          <Heart className="w-4 h-4" />
          Donate {amount}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DonationCard;