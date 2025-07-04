import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, Building, Flower, BookOpen, Users, Crown } from "lucide-react";
import DonationCard from "./DonationCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DonationSection = () => {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("1001");
  const navigate = useNavigate();

  const handleQuickDonate = () => {
    const amount = customAmount || selectedAmount;
    navigate(`/donate?amount=${amount}`);
  };

  const donationTypes = [
    {
      title: "Shree Krishna Seva",
      description: "Support daily worship and offerings",
      amount: "501",
      icon: <Flower className="w-6 h-6 text-primary" />
    },
    {
      title: "Temple Construction",
      description: "Help build the main temple structure",
      amount: "1001",
      icon: <Building className="w-6 h-6 text-primary" />,
      isPopular: true
    },
    {
      title: "Dharma Shala",
      description: "Contribute to devotee accommodation",
      amount: "2501",
      icon: <Users className="w-6 h-6 text-primary" />
    },
    {
      title: "Library & Education",
      description: "Support spiritual learning center",
      amount: "5001",
      icon: <BookOpen className="w-6 h-6 text-primary" />
    },
    {
      title: "Golden Kalash",
      description: "Sponsor temple dome decoration",
      amount: "11001",
      icon: <Crown className="w-6 h-6 text-primary" />
    },
    {
      title: "Maha Donation",
      description: "Major contribution for overall development",
      amount: "51001",
      icon: <Heart className="w-6 h-6 text-primary" />
    }
  ];

  const quickAmounts = ["501", "1001", "2501", "5001", "11001"];

  return (
    <section id="donate" className="py-16 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Support Temple Construction
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your generous donation will help us build a beautiful temple that will serve as a 
            center of worship and spiritual growth for generations to come.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Donation */}
          <div className="lg:col-span-1">
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

                <Button variant="sacred" size="lg" className="w-full" onClick={handleQuickDonate}>
                  <Heart className="w-4 h-4" />
                  Donate ₹{customAmount || selectedAmount}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Secure payment • Tax benefits available • 80G receipt provided
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donation Categories */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {donationTypes.map((donation, index) => (
                <DonationCard
                  key={index}
                  title={donation.title}
                  description={donation.description}
                  amount={donation.amount}
                  icon={donation.icon}
                  isPopular={donation.isPopular}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust Information */}
        <div className="mt-12 text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-peaceful">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Tax Benefits & Trust Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                All donations are eligible for 80G tax deduction under Income Tax Act. 
                Official receipts will be provided for all donations.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span>• 12A Registration Available</span>
                <span>• 80G Certificate Provided</span>
                <span>• Transparent Fund Usage</span>
                <span>• Regular Progress Updates</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;