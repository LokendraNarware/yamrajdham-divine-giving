import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | DHARAM DHAM TRUST',
  description: 'Get in touch with DHARAM DHAM TRUST for donations, inquiries, and temple information.',
};

export default function ContactPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-temple-saffron mb-4">
              Contact Us
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🕉️</span>
              <span className="text-temple-gold text-lg">DHARAM DHAM TRUST</span>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We would love to hear from you. Reach out to us for any inquiries, donations, or spiritual guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-background rounded-xl border border-border p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-temple-saffron mb-6 flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  Temple Address
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-temple-gold text-lg">🏛️</span>
                    <div>
                      <p className="text-temple-gold font-medium">DHARAM DHAM TRUST</p>
                      <p className="text-foreground">
                        Yamraj Dham, Dhani Raju<br />
                        Ta. Taranagar, Dist. Churu<br />
                        Rajasthan-331023
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-temple-gold text-lg">🕐</span>
                    <div>
                      <p className="text-temple-gold font-medium">Temple Hours</p>
                      <p className="text-foreground">
                        Open 24 Hours<br />
                        Daily Darshan Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-xl border border-border p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-temple-saffron mb-6 flex items-center gap-2">
                  <span className="text-xl">📞</span>
                  Contact Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-temple-gold text-lg">📱</span>
                    <div>
                      <p className="text-temple-gold font-medium">Phone</p>
                      <p className="text-foreground">+91 96625 44676, +91 84273 83381</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-temple-gold text-lg">📧</span>
                    <div>
                      <p className="text-temple-gold font-medium">Email</p>
                      <p className="text-foreground">dharamdhamtrust@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-temple-gold text-lg">💰</span>
                    <div>
                      <p className="text-temple-gold font-medium">Donations</p>
                      <p className="text-foreground">dharamdhamtrust@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-xl border border-border p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-temple-saffron mb-6 flex items-center gap-2">
                  <span className="text-xl">🏦</span>
                  Banking Details
                </h2>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg border border-border">
                    <p className="text-temple-gold font-medium mb-2">Bank Account:</p>
                    <p className="text-temple-sand/90">Account Name: DHARAM DHAM TRUST</p>
                    <p className="text-temple-sand/90">Regd. No.- RAJ-202401341007870</p>
                    <p className="text-temple-sand/90">12AA & 80G approved</p>
                    <p className="text-temple-sand/90">PAN No.: AAETD9289Q</p>
                    <p className="text-temple-sand/90">Temple Trust NGO Regd. by Government of India Trust Act, 1882</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg border border-border">
                    <p className="text-temple-gold font-medium mb-2">UPI Details:</p>
                    <p className="text-temple-sand/90">Mobile: +91 96625 44676, +91 84273 83381</p>
                    <p className="text-temple-sand/90">Website: https://dharamdhamtrust.org</p>
                    <p className="text-temple-sand/90">Email ID: dharamdhamtrust@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-8">
              <h2 className="text-2xl font-semibold text-temple-saffron mb-6 flex items-center gap-2">
                <span className="text-xl">✉️</span>
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-temple-gold font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                     className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-temple-gold font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                     className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-temple-gold font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                     className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-temple-gold font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 bg-temple-charcoal/30 border border-temple-gold/30 rounded-lg text-temple-sand focus:border-temple-saffron focus:outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="donation">Donation Inquiry</option>
                    <option value="temple-info">Temple Information</option>
                    <option value="spiritual-guidance">Spiritual Guidance</option>
                    <option value="construction">Construction Updates</option>
                    <option value="events">Events & Ceremonies</option>
                    <option value="volunteer">Volunteer Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-temple-gold font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-temple-charcoal/30 border border-temple-gold/30 rounded-lg text-temple-sand placeholder-temple-sand/60 focus:border-temple-saffron focus:outline-none transition-colors resize-none"
                    placeholder="Enter your message here..."
                  />
                </div>
                
                <button
                  type="submit"
                     className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Social Media & Additional Info */}
          <div className="mt-12">
            <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-8">
              <h2 className="text-2xl font-semibold text-temple-saffron mb-6 text-center">
                Follow Our Journey
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-temple-gold font-medium mb-2">Facebook</h3>
                  <p className="text-muted-foreground text-sm">Stay updated with construction progress</p>
                </div>
                <div>
                  <h3 className="text-temple-gold font-medium mb-2">Instagram</h3>
                  <p className="text-muted-foreground text-sm">See daily temple activities and events</p>
                </div>
                <div>
                  <h3 className="text-temple-gold font-medium mb-2">YouTube</h3>
                  <p className="text-muted-foreground text-sm">Watch ceremonies and spiritual content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   );
 }
