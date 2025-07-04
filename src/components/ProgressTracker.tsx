import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building, Users, Target, Calendar } from "lucide-react";
import constructionImage from "@/assets/construction-progress.jpg";

const ProgressTracker = () => {
  const progressData = {
    totalGoal: 5000000, // 50 lakhs
    currentAmount: 3250000, // 32.5 lakhs
    percentage: 65,
    donors: 1247,
    daysLeft: 180
  };

  const milestones = [
    { name: "Foundation", completed: true, icon: Building },
    { name: "Structure", completed: true, icon: Building },
    { name: "Roof & Domes", completed: false, icon: Building },
    { name: "Interior", completed: false, icon: Building },
    { name: "Final Touches", completed: false, icon: Building }
  ];

  return (
    <section className="py-16 bg-gradient-peaceful">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Temple Construction Progress
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch our sacred temple come to life with your generous contributions. 
            Every donation brings us closer to completion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Funding Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Raised: ₹{(progressData.currentAmount / 100000).toFixed(1)} Lakhs</span>
                    <span>Goal: ₹{(progressData.totalGoal / 100000)} Lakhs</span>
                  </div>
                  <Progress value={progressData.percentage} className="h-3" />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary">
                      {progressData.percentage}%
                    </span>
                    <span className="text-muted-foreground"> Complete</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{progressData.donors.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Donors</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{progressData.daysLeft}</div>
                  <div className="text-sm text-muted-foreground">Days Left</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Construction Milestones</CardTitle>
                <CardDescription>Track the progress of each construction phase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.completed 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <milestone.icon className="w-4 h-4" />
                      </div>
                      <span className={milestone.completed ? 'text-foreground' : 'text-muted-foreground'}>
                        {milestone.name}
                      </span>
                      {milestone.completed && (
                        <span className="ml-auto text-sm text-primary font-medium">✓ Complete</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden shadow-temple">
              <img 
                src={constructionImage} 
                alt="Temple construction progress" 
                className="w-full h-64 object-cover"
              />
            </div>
            
            <Card className="bg-gradient-gold">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Latest Update</h3>
                <p className="text-sm text-secondary-foreground">
                  The main structure is now complete! We've begun work on the beautiful 
                  traditional domes and spires. The intricate stone carvings are being 
                  crafted by master artisans.
                </p>
                <p className="text-xs text-secondary-foreground/80 mt-2">
                  Updated: December 2024
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressTracker;