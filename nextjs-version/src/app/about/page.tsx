import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us - DHARAM DHAM TRUST",
  description: "Learn about DHARAM DHAM TRUST, our mission to build Yamrajdham Temple, and our spiritual leader Mataji's divine guidance in Taranagar, Churu, Rajasthan.",
  keywords: [
    "About DHARAM DHAM TRUST",
    "Yamrajdham Temple Trust",
    "Mataji Spiritual Leader",
    "Temple Mission",
    "Spiritual Guidance",
    "Taranagar Churu Temple",
    "Hindu Temple Trust",
    "Divine Mission",
    "Spiritual Education",
    "Community Service"
  ],
  openGraph: {
    title: "About Us - DHARAM DHAM TRUST",
    description: "Learn about DHARAM DHAM TRUST, our mission to build Yamrajdham Temple, and our spiritual leader Mataji's divine guidance.",
    images: [
      {
        url: '/mataji.png',
        width: 1200,
        height: 630,
        alt: 'Mataji - Spiritual Leader of DHARAM DHAM TRUST',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Us - DHARAM DHAM TRUST",
    description: "Learn about our mission to build Yamrajdham Temple and Mataji's divine guidance.",
    images: ['/mataji.png'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="w-full">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-peaceful">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-temple-soft-peach px-4 py-2 rounded-full mb-6">
                <span className="text-temple-brown font-medium">About DHARAM DHAM TRUST</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-temple-charcoal mb-6">
                🌸 About Us
              </h1>
              
              <p className="text-xl text-temple-grey leading-relaxed max-w-4xl mx-auto mb-8">
                DHARAM DHAM TRUST is dedicated to building Yamrajdham Temple, a divine center of spirituality, faith, and service. Our mission is to create a sacred space where devotion, wisdom, and community come together for generations to come.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-temple-gold/20 shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🛕</div>
                    <h3 className="text-lg font-semibold text-temple-charcoal mb-2">Temple Construction</h3>
                    <p className="text-sm text-temple-grey">Building Yamrajdham Temple as a beacon of Sanatan Dharma</p>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-temple-gold/20 shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-3">👥</div>
                    <h3 className="text-lg font-semibold text-temple-charcoal mb-2">Community Service</h3>
                    <p className="text-sm text-temple-grey">Serving devotees through Dharamshala and education centers</p>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-temple-gold/20 shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🙏</div>
                    <h3 className="text-lg font-semibold text-temple-charcoal mb-2">Spiritual Growth</h3>
                    <p className="text-sm text-temple-grey">Promoting seva, meditation, and spiritual learning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mataji's Inspiration Section */}
        <section className="py-16 bg-gradient-peaceful">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Image */}
              <div className="relative">
                <div className="relative z-10">
                  <div className="w-80 h-80 mx-auto lg:mx-0 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                    <img 
                      src="/mataji.png" 
                      alt="Mataji - Spiritual Leader" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-temple-gold rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-temple-brown rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">❤️</span>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-temple-gold font-medium">🕉️ Mataji's Divine Guidance</span>
                  </div>
                  
                  <blockquote className="text-2xl md:text-3xl font-bold text-temple-charcoal leading-tight italic">
                    "Faith is not just devotion – it is service and awareness."
                  </blockquote>
                  
                  <div className="w-20 h-1 bg-temple-gold rounded-full"></div>
                  
                  <p className="text-lg text-temple-grey leading-relaxed">
                    माताजी ने अपने जीवन को केवल भक्ति तक सीमित नहीं रखा, बल्कि जनकल्याण और आध्यात्मिक जागरूकता को भी अपना उद्देश्य बनाया।
                  </p>
                  
                  <p className="text-lg text-temple-grey leading-relaxed">
                    Inspired by Mataji's teachings, the <strong>DHARAM DHAM TRUST</strong> was founded with a sacred mission to build Yamrajdham Temple and serve humanity through spiritual awareness and community service.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="divine"
                    size="lg" 
                    className="px-8 py-3 rounded-full font-semibold"
                  >
                    🙏 Learn More About Mataji
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-temple-gold text-temple-gold hover:bg-temple-cream px-8 py-3 rounded-full font-semibold"
                  >
                    🤝 Join Our Mission
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 bg-temple-cream">
          <div className="container mx-auto px-4 max-w-6xl">
            <Card className="shadow-temple border-temple-gold/20">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-divine text-white px-6 py-3 rounded-full mb-4 mx-auto">
                  <span className="font-semibold">🕉️ Our Mission</span>
                </div>
                <CardTitle className="text-3xl md:text-4xl text-temple-charcoal">
                  Building a Beacon of Sanatan Dharma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-temple-peach/10 p-3 rounded-full">
                        <span className="text-2xl">🛕</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-temple-charcoal mb-2">Temple Construction</h3>
                        <p className="text-temple-grey">To construct the grand Yamrajdham Temple as a beacon of Sanatan Dharma.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-temple-peach/10 p-3 rounded-full">
                        <span className="text-2xl">📚</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-temple-charcoal mb-2">Spiritual Education</h3>
                        <p className="text-temple-grey">To spread spiritual awareness and cultural values through education.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-temple-peach/10 p-3 rounded-full">
                        <span className="text-2xl">👥</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-temple-charcoal mb-2">Community Service</h3>
                        <p className="text-temple-grey">To provide facilities like Dharamshala, library, and education center for devotees.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-temple-peach/10 p-3 rounded-full">
                        <span className="text-2xl">❤️</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-temple-charcoal mb-2">Seva & Devotion</h3>
                        <p className="text-temple-grey">To promote seva, meditation, and spiritual learning for all devotees.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Vision Section */}
        <section className="py-16 bg-gradient-brown text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full mb-6">
                <span className="font-semibold">🌟 Our Vision</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                A Divine City of Faith
              </h2>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto opacity-90">
                We envision Dharam Dham Paavan Nagari as a divine city of faith—where devotees experience inner peace, learn spiritual wisdom, and contribute to building a stronger society rooted in dharma.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🕊️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Inner Peace</h3>
                  <p className="opacity-90">A sacred space where devotees find tranquility and spiritual fulfillment.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">📖</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Spiritual Wisdom</h3>
                  <p className="opacity-90">Learning centers dedicated to preserving and sharing ancient knowledge.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Community Building</h3>
                  <p className="opacity-90">Fostering a society rooted in dharma, compassion, and service.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Yamraj Significance Section */}
        <section className="py-16 bg-gradient-to-br from-temple-charcoal to-temple-grey text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border border-temple-peach rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 border border-temple-peach rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-temple-peach rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Content */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-temple-peach font-medium">🛕 Why Yamrajdham Temple?</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                      Yamraj, also known as Dharmaraj, is not a deity to fear, but the guardian of moral order and justice.
                    </h2>
                    
                    <div className="w-20 h-1 bg-temple-peach rounded-full"></div>
                    
                    <p className="text-lg leading-relaxed text-gray-300">
                      At Yamrajdham Temple, we honor him as the divine ruler who guides souls after life, balancing karma and dharma with compassion.
                    </p>
                    
                    <p className="text-lg leading-relaxed text-gray-300">
                      Building a temple dedicated to Yamraj is a rare spiritual milestone – one that preserves ancient wisdom while uplifting future generations.
                    </p>
                    
                    <div className="bg-temple-grey/30 rounded-lg p-4 mt-6">
                      <h3 className="text-xl font-bold text-temple-peach mb-3">🌟 Divine Significance</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Yamraj represents the cosmic principle of justice, karma, and dharma. Our temple will serve as a sacred space for devotees to understand the deeper meaning of righteousness and spiritual accountability.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side - Image and Features */}
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="relative">
                    <div className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
                      <img 
                        src="/temple-hero.jpg" 
                        alt="Yamrajdham Temple Construction" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-xl font-bold">DHARAM DHAM PAAVAN NAGARI TRUST</h4>
                      <p className="text-sm opacity-90">Building Yamrajdham Temple</p>
                    </div>
                  </div>

                  {/* Feature Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-temple-grey/50 border-temple-peach/30">
                      <CardContent className="p-4 text-center">
                        <span className="text-3xl mb-2 block">⚖️</span>
                        <h4 className="font-semibold text-sm">Divine Justice</h4>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-temple-grey/50 border-temple-peach/30">
                      <CardContent className="p-4 text-center">
                        <span className="text-3xl mb-2 block">🛡️</span>
                        <h4 className="font-semibold text-sm">Moral Order</h4>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-temple-grey/50 border-temple-peach/30">
                      <CardContent className="p-4 text-center">
                        <span className="text-3xl mb-2 block">📚</span>
                        <h4 className="font-semibold text-sm">Dharma</h4>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-temple-grey/50 border-temple-peach/30">
                      <CardContent className="p-4 text-center">
                        <span className="text-3xl mb-2 block">⭐</span>
                        <h4 className="font-semibold text-sm">Spiritual Growth</h4>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Temple Construction Section */}
        <section className="py-16 bg-temple-cream">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-temple-peach/10 px-6 py-3 rounded-full mb-6">
                <span className="font-semibold text-temple-brown">🛕 Temple Construction</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-temple-charcoal mb-6">
                Sacred Architecture & Facilities
              </h2>
              <p className="text-xl text-temple-grey max-w-3xl mx-auto">
                The temple will feature magnificent architecture and comprehensive facilities to serve the spiritual needs of devotees.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-temple border-temple-gold/20 hover:shadow-divine transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-divine text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <h3 className="text-xl font-semibold text-temple-charcoal mb-3">Main Sanctum</h3>
                  <p className="text-temple-grey">Sacred space housing the divine Yamraj idol with traditional architecture.</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-temple border-temple-gold/20 hover:shadow-divine transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-gold text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">✨</span>
                  </div>
                  <h3 className="text-xl font-semibold text-temple-charcoal mb-3">Golden Kalash</h3>
                  <p className="text-temple-grey">Magnificent golden dome adorning the temple with divine radiance.</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-temple border-temple-gold/20 hover:shadow-divine transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-coral text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <h3 className="text-xl font-semibold text-temple-charcoal mb-3">Dharamshala</h3>
                  <p className="text-temple-grey">Comfortable accommodation facilities for visiting devotees.</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-temple border-temple-gold/20 hover:shadow-divine transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-brown text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="text-xl font-semibold text-temple-charcoal mb-3">Library & Education</h3>
                  <p className="text-temple-grey">Spiritual education center with extensive collection of sacred texts.</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-temple border-temple-gold/20 hover:shadow-divine transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-peaceful text-temple-charcoal p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🧘</span>
                  </div>
                  <h3 className="text-xl font-semibold text-temple-charcoal mb-3">Meditation Halls</h3>
                  <p className="text-temple-grey">Peaceful spaces for meditation, prayer, and spiritual contemplation.</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-temple border-temple-gold/20 hover:shadow-divine transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-divine text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🙏</span>
                  </div>
                  <h3 className="text-xl font-semibold text-temple-charcoal mb-3">Worship Spaces</h3>
                  <p className="text-temple-grey">Dedicated areas for various religious ceremonies and community gatherings.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Seva & Contribution Section */}
        <section className="py-16 bg-gradient-peaceful">
          <div className="container mx-auto px-4 max-w-6xl">
            <Card className="shadow-temple border-temple-gold/20">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center gap-2 bg-temple-peach/10 px-6 py-3 rounded-full mb-4 mx-auto">
                  <span className="font-semibold text-temple-brown">🙏 Seva & Contribution</span>
                </div>
                <CardTitle className="text-3xl md:text-4xl text-temple-charcoal">
                  Join the Divine Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <p className="text-xl text-temple-grey leading-relaxed max-w-4xl mx-auto mb-8">
                    Every devotee can take part in this divine journey through donations, seva, or volunteering. Each contribution—big or small—helps in building this sacred abode.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="divine" 
                      size="lg"
                      className="shadow-temple hover:shadow-divine"
                    >
                      ❤️ Donate Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-temple-gold text-temple-charcoal hover:bg-temple-soft-peach"
                    >
                      👥 Volunteer
                    </Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <div className="text-center">
                    <div className="bg-temple-peach/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">💰</span>
                    </div>
                    <h3 className="text-xl font-semibold text-temple-charcoal mb-3">Financial Support</h3>
                    <p className="text-temple-grey">Your donations help fund construction, maintenance, and community services.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-temple-peach/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">🤝</span>
                    </div>
                    <h3 className="text-xl font-semibold text-temple-charcoal mb-3">Volunteer Service</h3>
                    <p className="text-temple-grey">Contribute your time and skills to support temple activities and events.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-temple-peach/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">📿</span>
                    </div>
                    <h3 className="text-xl font-semibold text-temple-charcoal mb-3">Spiritual Participation</h3>
                    <p className="text-temple-grey">Join prayers, ceremonies, and spiritual learning programs.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Trust Information Section */}
        <section className="py-16 bg-temple-cream">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-temple-peach/10 px-6 py-3 rounded-full mb-6">
                <span className="font-semibold text-temple-brown">📑 Trust Information</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-temple-charcoal mb-6">
                Official Trust Details
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-temple border-temple-gold/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-temple-charcoal flex items-center gap-3">
                    <span className="text-2xl">🛡️</span>
                    Trust Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-temple-peach/10 p-2 rounded-full">
                      <span className="text-xl">🏛️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-temple-charcoal">Trust Name</h3>
                      <p className="text-temple-grey">DHARAM DHAM TRUST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-temple-peach/10 p-2 rounded-full">
                      <span className="text-xl">📋</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-temple-charcoal">Registration No.</h3>
                      <p className="text-temple-grey">RAJ-202401341007870</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-temple-peach/10 p-2 rounded-full">
                      <span className="text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-temple-charcoal">Email</h3>
                      <p className="text-temple-grey">dharamdhamtrust@gmail.com</p>
                      <p className="text-sm text-temple-grey mt-1">For donations, inquiries, and seva opportunities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-temple-peach/10 p-2 rounded-full">
                      <span className="text-xl">🌐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-temple-charcoal">Website</h3>
                      <p className="text-temple-grey">https://dharamdhamtrust.org</p>
                      <p className="text-sm text-temple-grey mt-1">Stay updated with temple progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-temple border-temple-gold/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-temple-charcoal flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-temple-peach/10 p-2 rounded-full">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-temple-charcoal">Address</h3>
                      <p className="text-temple-grey">Yamraj Dham, Dhani Raju, Ta. Taranagar, Dist. Churu, Rajasthan-331023</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-temple-peach/10 p-2 rounded-full">
                      <span className="text-xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-temple-charcoal">Phone</h3>
                      <p className="text-temple-grey">+91 96625 44676, +91 84273 83381</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-temple-peach/10 p-2 rounded-full">
                      <span className="text-xl">🕐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-temple-charcoal">Office Hours</h3>
                      <p className="text-temple-grey">Monday - Sunday: 6:00 AM - 9:00 PM</p>
                      <p className="text-sm text-temple-grey mt-1">Temple visits and seva opportunities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-temple-peach/10 p-2 rounded-full">
                      <span className="text-xl">💳</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-temple-charcoal">Donation Methods</h3>
                      <p className="text-temple-grey">Online donations, Bank transfers, Cash donations</p>
                      <p className="text-sm text-temple-grey mt-1">All donations are tax-deductible</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-brown text-white">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              🙏 Be Part of This Sacred Mission
            </h2>
            <p className="text-xl leading-relaxed mb-8 opacity-90">
              Join us in building Yamrajdham Temple, a divine center that will serve as a beacon of faith, wisdom, and community for generations to come.
            </p>
            
            <div className="bg-white/10 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-4">📑 Complete Trust Information</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="text-left">
                  <div className="mb-3">
                    <strong>Trust Name:</strong> DHARAM DHAM TRUST<br/>
                    <strong>Registration:</strong> [Trust Registration No.]<br/>
                    <strong>Email:</strong> dharamdhamtrust@gmail.com
                  </div>
                  <div>
                    <strong>Location:</strong> Taranagar Churu, Rajasthan<br/>
                    <strong>Website:</strong> https://dharamdhamtrust.org<br/>
                    <strong>Office Hours:</strong> 6:00 AM - 9:00 PM (Daily)
                  </div>
                </div>
                <div className="text-left">
                  <div className="mb-3">
                    <strong>Donation Methods:</strong><br/>
                    • Online donations<br/>
                    • Bank transfers<br/>
                    • Cash donations<br/>
                    • All donations are tax-deductible
                  </div>
                  <div>
                    <strong>Seva Opportunities:</strong><br/>
                    • Temple construction<br/>
                    • Community service<br/>
                    • Spiritual programs<br/>
                    • Educational initiatives
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="divine" 
                size="lg"
                className="bg-white text-temple-gold hover:bg-temple-cream shadow-temple"
              >
                ❤️ Support the Temple
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-temple-gold"
              >
                📧 Contact Us
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-temple-gold"
              >
                🤝 Volunteer
              </Button>
            </div>
          </div>
        </section>
    </div>
  );
}