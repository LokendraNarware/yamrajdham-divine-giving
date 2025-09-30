import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Shield, BookOpen, Star, Sparkles } from "lucide-react";

export default function YamrajDhamSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-orange-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-orange-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-orange-400 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-orange-400" />
                  <span className="text-orange-400 font-medium">🛕 Why Yamrajdham Temple?</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Yamraj, also known as Dharmaraj, is not a deity to fear, but the guardian of moral order and justice.
                </h2>
                
                <div className="w-20 h-1 bg-orange-500 rounded-full"></div>
                
                <p className="text-lg leading-relaxed text-gray-300">
                  At Yamrajdham, we honor him as the divine ruler who guides souls after life, balancing karma and dharma with compassion.
                </p>
                
                <p className="text-lg leading-relaxed text-gray-300">
                  ✨ Building a temple dedicated to Yamraj is a rare spiritual milestone – one that preserves ancient wisdom while uplifting future generations.
                </p>
              </div>

              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold"
              >
                Learn More About Yamraj
              </Button>
            </div>

            {/* Right side - Image and Features */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative">
                <div className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/temple-hero.jpg" 
                    alt="Yamraj Dham Temple Construction" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-bold">DHARAM DHAM PAAVAN NAGARI</h4>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Scale className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Divine Justice</h4>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Moral Order</h4>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Dharma</h4>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Spiritual Growth</h4>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
