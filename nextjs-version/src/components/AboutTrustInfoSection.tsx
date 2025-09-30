import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, FileText, Shield, Award } from "lucide-react";

const AboutTrustInfoSection = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-temple-charcoal">
            📑 Trust Information
          </h2>
          <div className="w-24 h-1 bg-gradient-divine mx-auto mb-8"></div>
          <p className="text-lg text-temple-grey max-w-3xl mx-auto">
            Dharam Dham Paavan Nagari Trust operates with complete transparency and legal compliance, ensuring every contribution is used responsibly for the temple construction.
          </p>
        </div>
        
        {/* Main Trust Info Card */}
        <Card className="mb-12 border-2 border-temple-peach/20 shadow-lg">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-temple-peach to-temple-gold rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-temple-charcoal">
                    Trust Details
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-temple-cream to-temple-peach rounded-lg p-4">
                    <div className="font-semibold text-temple-charcoal mb-2">Trust Name</div>
                    <div className="text-temple-grey">Dharam Dham Paavan Nagari Trust</div>
                  </div>
                  
                  <div className="bg-white border border-border/30 rounded-lg p-4">
                    <div className="font-semibold text-temple-charcoal mb-2">Registration Number</div>
                    <div className="text-temple-grey">[Trust Registration No.]</div>
                  </div>
                  
                  <div className="bg-white border border-border/30 rounded-lg p-4">
                    <div className="font-semibold text-temple-charcoal mb-2">Email Address</div>
                    <div className="text-temple-grey">dharamdhamtrust@gmail.com</div>
                  </div>
                  
                  <div className="bg-white border border-border/30 rounded-lg p-4">
                    <div className="font-semibold text-temple-charcoal mb-2">Address</div>
                    <div className="text-temple-grey">[Temple Address / City / State]</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-temple-gold to-temple-peach rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-temple-charcoal">
                    Legal Compliance
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-temple-grey">
                      <strong>Registered Trust:</strong> Legally established under Indian Trust Act
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-temple-grey">
                      <strong>Tax Exemption:</strong> Eligible for tax-deductible donations under Section 80G
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-temple-grey">
                      <strong>Transparent Operations:</strong> Regular audits and financial reporting
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-temple-peach rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-temple-grey">
                      <strong>Accountability:</strong> Board of trustees ensures proper fund utilization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-temple-peach to-temple-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-temple-charcoal">Email Us</h3>
              <p className="text-temple-grey mb-4">Get in touch for any queries</p>
              <Button variant="outline" size="sm">
                dharamdhamtrust@gmail.com
              </Button>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-temple-gold to-temple-peach rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-temple-charcoal">Call Us</h3>
              <p className="text-temple-grey mb-4">Speak with our team</p>
              <Button variant="outline" size="sm">
                [Phone Number]
              </Button>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-temple-peach to-temple-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-temple-charcoal">Visit Us</h3>
              <p className="text-temple-grey mb-4">Come to our temple site</p>
              <Button variant="outline" size="sm">
                [Temple Address]
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Trust Board */}
        <div className="bg-gradient-to-r from-temple-cream to-temple-peach rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-temple-charcoal" />
            </div>
            <h3 className="text-2xl font-bold text-temple-charcoal mb-4">
              Board of Trustees
            </h3>
            <p className="text-temple-grey">
              Our dedicated board of trustees ensures the trust operates with integrity, transparency, and in accordance with our sacred mission.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/50 rounded-lg p-4 text-center">
              <div className="font-semibold text-temple-charcoal mb-2">Chairman</div>
              <div className="text-temple-grey">[Chairman Name]</div>
            </div>
            <div className="bg-white/50 rounded-lg p-4 text-center">
              <div className="font-semibold text-temple-charcoal mb-2">Secretary</div>
              <div className="text-temple-grey">[Secretary Name]</div>
            </div>
            <div className="bg-white/50 rounded-lg p-4 text-center">
              <div className="font-semibold text-temple-charcoal mb-2">Treasurer</div>
              <div className="text-temple-grey">[Treasurer Name]</div>
            </div>
          </div>
        </div>
        
        {/* Final CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg border border-border/30 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-temple-charcoal">
              Ready to Support Our Mission?
            </h3>
            <p className="text-lg text-temple-grey mb-6">
              Join thousands of devotees who are already contributing to this divine cause. Your support helps us build a sacred space for generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="divine" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                Make a Donation
              </Button>
              <Button variant="outline" size="lg">
                Contact Trust
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTrustInfoSection;
