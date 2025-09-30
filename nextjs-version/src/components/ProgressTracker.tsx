import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar } from "lucide-react";

const ProgressTracker = () => {
  const milestones = [
    { name: "Foundation complete", completed: true, icon: Building },
    { name: "Structure complete", completed: true, icon: Building },
    { name: "Domes & interiors in progress", completed: false, icon: Building }
  ];

  return (
    <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-temple-gold font-medium">Temple Construction Progress</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Together, we are bringing Yamraj dham Temple to life.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Temple Construction Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary">
                      Construction in Progress
                    </span>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Master artisans are crafting traditional domes & stone carvings
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-y-4">
              <div className="text-lg">
                <span className="font-semibold">Construction Milestones:</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Foundation complete</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Structure complete</span>
                <span className="px-3 py-1 bg-temple-cream text-temple-gold rounded-full text-sm">Domes & interiors in progress</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden shadow-temple">
              <img 
                src="/construction-progress.jpg" 
                alt="Temple construction progress" 
                className="w-full h-64 object-cover"
              />
            </div>
            
            <Card className="bg-gradient-gold">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Latest Update (Dec 2024)</h3>
                <p className="text-sm text-secondary-foreground">
                  Traditional domes & stone carvings are now being crafted by master artisans.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default ProgressTracker;
