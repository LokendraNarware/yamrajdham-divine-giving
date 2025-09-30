import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-temple-charcoal text-temple-sand">
      {/* Main Footer Header */}
      <div className="border-b border-temple-gold/30">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-temple-saffron flex items-center justify-center gap-2">
              <span className="text-2xl">🕉️</span>
              Yamraj Dham Trust – Yamraj dham Temple
            </h2>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-temple-saffron border-b border-temple-gold/30 pb-2">
              Address
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-temple-saffron">Yamraj Dham Trust</p>
                <p className="text-temple-sand/80">Temple Address</p>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-temple-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-temple-sand/80">+91 84273 83381</p>
                  <p className="text-temple-sand/80">Temple Office</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-temple-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-temple-sand/80">info@yamrajdham.org</p>
                  <p className="text-temple-sand/80">donations@yamrajdham.org</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-temple-saffron mt-0.5 flex-shrink-0" />
                <p className="text-temple-sand/80">
                  Raju ki dhani, Yamraj dham Temple<br />
                  On road NH-52, Rajgarh Churu<br />
                  Taranagar, Rajasthan 331304
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 text-temple-saffron mt-0.5 flex-shrink-0 flex items-center justify-center">
                  🕐
                </div>
                <div>
                  <p className="text-temple-sand/80 font-medium">Temple Hours:</p>
                  <p className="text-temple-sand/80">Open 24 Hours</p>
                  <p className="text-temple-sand/80">Daily Darshan Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-temple-saffron border-b border-temple-gold/30 pb-2">
              Quick Links
            </h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Home
              </Link>
              <Link href="#about" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - About Temple
              </Link>
              <Link href="/donate" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Donate
              </Link>
              <Link href="#projects" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Projects
              </Link>
              <Link href="#gallery" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Gallery
              </Link>
              <Link href="#contact" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Contact
              </Link>
            </div>
          </div>

          {/* Follow Us Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-temple-saffron border-b border-temple-gold/30 pb-2">
              Follow Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <a 
                  href="https://facebook.com/yamrajdham" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-temple-sand/80 hover:text-temple-saffron transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="text-sm">Facebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="https://instagram.com/yamrajdham" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-temple-sand/80 hover:text-temple-saffron transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm">Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="https://youtube.com/@yamrajdham" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-temple-sand/80 hover:text-temple-saffron transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  <span className="text-sm">YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Legal Pages Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-temple-saffron border-b border-temple-gold/30 pb-2">
              Legal Pages
            </h3>
            <div className="space-y-2 text-sm">
              <Link href="/privacy-policy" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Terms & Conditions
              </Link>
              <Link href="/refund-policy" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Refund & Cancellation Policy
              </Link>
              <Link href="/disclaimer" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Disclaimer
              </Link>
              <Link href="/donation-policy" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Donation Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Support Temple Construction Section */}
        <div className="mt-12 pt-8 border-t border-temple-gold/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-temple-saffron border-b border-temple-gold/30 pb-2">
                Support Temple Construction
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-temple-saffron mb-2">Bank Details:</p>
                  <div className="bg-temple-charcoal/50 p-3 rounded border border-temple-gold/20">
                    <p className="text-temple-sand/80">Account Name: Yamraj Dham Trust</p>
                    <p className="text-temple-sand/80">Bank: State Bank of India</p>
                    <p className="text-temple-sand/80">Account Number: 1234567890123456</p>
                    <p className="text-temple-sand/80">IFSC Code: SBIN0001234</p>
                    <p className="text-temple-sand/80">Branch: Taranagar Branch, Rajasthan</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-temple-saffron mb-2">UPI Details:</p>
                  <div className="bg-temple-charcoal/50 p-3 rounded border border-temple-gold/20">
                    <p className="text-temple-sand/80">UPI ID: donations@yamrajdham</p>
                    <p className="text-temple-sand/80">PhonePe: +91 84273 83381</p>
                    <p className="text-temple-sand/80">GooglePay: +91 84273 83381</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-temple-saffron border-b border-temple-gold/30 pb-2">
                Temple Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-temple-charcoal/50 p-3 rounded border border-temple-gold/20">
                  <p className="text-temple-sand/80 mb-2">Google Reviews:</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-temple-saffron font-bold text-lg">5.0</span>
                    <div className="flex text-temple-saffron">
                      ⭐⭐⭐⭐⭐
                    </div>
                  </div>
                </div>
                <div className="bg-temple-charcoal/50 p-3 rounded border border-temple-gold/20">
                  <p className="text-temple-sand/80 mb-2">Construction Progress:</p>
                  <div className="w-full bg-temple-gold/20 rounded-full h-2 mb-2">
                    <div className="bg-temple-saffron h-2 rounded-full" style={{width: '35%'}}></div>
                  </div>
                  <p className="text-temple-saffron font-medium">35% Complete</p>
                </div>
                <div className="text-temple-sand/80">
                  <p>• Foundation: ✅ Complete</p>
                  <p>• Ground Floor: 🔄 In Progress</p>
                  <p>• First Floor: ⏳ Pending</p>
                  <p>• Dome Construction: ⏳ Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-temple-gold/30 bg-temple-charcoal/80">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-temple-saffron">🕉️</span>
              <span className="text-temple-saffron font-medium">Yamraj Dham Trust</span>
            </div>
            <p className="text-sm text-temple-sand/80">
              © 2025 Yamraj Dham Trust | All Rights Reserved
            </p>
            <p className="text-xs text-temple-sand/60 mt-1">
              Building Yamraj dham Temple with devotion, dedication, and divine blessings
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
