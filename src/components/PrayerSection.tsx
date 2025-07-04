import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Flame, Star, Users } from "lucide-react";
import prayerShrineImage from "@/assets/prayer-shrine.jpg";
import { useState } from "react";

const PrayerSection = () => {
  const [prayerForm, setPrayerForm] = useState({
    name: "",
    email: "",
    prayer: "",
    type: "general"
  });

  const prayerTypes = [
    { id: "general", label: "General Blessing", icon: Heart, price: "Free" },
    { id: "special", label: "Special Prayer", icon: Star, price: "₹101" },
    { id: "havan", label: "Havan Ceremony", icon: Flame, price: "₹501" },
    { id: "group", label: "Group Prayer", icon: Users, price: "₹1001" }
  ];

  const recentPrayers = [
    "For good health and prosperity of family - Anonymous",
    "Success in new business venture - Devotee from Mumbai",
    "Safe journey and return of son - Mother from Delhi",
    "Peace and happiness for all - Ram Kumar",
    "Recovery from illness - Sunita Devi"
  ];

  return (
    <section id="prayers" className="py-16 bg-gradient-peaceful">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Submit Your Prayer Request
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your heartfelt prayers and wishes. Our priests will include your intentions 
            in daily worship and special ceremonies at the temple.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Prayer Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prayer Request Form</CardTitle>
                <CardDescription>
                  Fill out the form below to submit your prayer request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name</label>
                    <Input
                      placeholder="Enter your name"
                      value={prayerForm.name}
                      onChange={(e) => setPrayerForm({ ...prayerForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={prayerForm.email}
                      onChange={(e) => setPrayerForm({ ...prayerForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prayer Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {prayerTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant={prayerForm.type === type.id ? "divine" : "outline"}
                        size="sm"
                        onClick={() => setPrayerForm({ ...prayerForm, type: type.id })}
                        className="justify-start"
                      >
                        <type.icon className="w-4 h-4" />
                        <div className="flex flex-col items-start">
                          <span className="text-xs">{type.label}</span>
                          <span className="text-xs opacity-70">{type.price}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Prayer Request</label>
                  <Textarea
                    placeholder="Share your prayer, wishes, or intentions..."
                    rows={4}
                    value={prayerForm.prayer}
                    onChange={(e) => setPrayerForm({ ...prayerForm, prayer: e.target.value })}
                  />
                </div>

                <Button variant="sacred" size="lg" className="w-full">
                  <Heart className="w-4 h-4" />
                  Submit Prayer Request
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your prayer will be included in our daily worship. 
                  We respect your privacy and keep all requests confidential.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Prayer Info & Recent Prayers */}
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden shadow-temple">
              <img 
                src={prayerShrineImage} 
                alt="Prayer shrine with deity" 
                className="w-full h-64 object-cover"
              />
            </div>

            <Card className="bg-gradient-gold">
              <CardHeader>
                <CardTitle>Prayer Schedule</CardTitle>
                <CardDescription className="text-secondary-foreground/80">
                  Daily worship timings and special ceremonies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Morning Aarti</span>
                    <span className="font-medium">6:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Special Prayers</span>
                    <span className="font-medium">12:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evening Aarti</span>
                    <span className="font-medium">7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Night Prayer</span>
                    <span className="font-medium">9:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Prayer Intentions</CardTitle>
                <CardDescription>
                  Recent prayers submitted by devotees (anonymous)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPrayers.map((prayer, index) => (
                    <div key={index} className="text-sm p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <Heart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{prayer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrayerSection;