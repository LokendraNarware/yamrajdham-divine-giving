import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, ExternalLink, Twitter } from "lucide-react";
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
                DHARAM DHAM TRUST – YAMRAJ - THE JUDGE OF KARMA, THE GUARDIAN OF DHARMA
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
                <p className="font-medium text-temple-saffron">DHARAM DHAM TRUST</p>
                <p className="text-temple-sand/80">Yamraj Dham, Dhani Raju, Ta. Taranagar, Dist. Churu, Rajasthan-331023</p>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-temple-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-temple-sand/80">+91 96625 44676, +91 84273 83381</p>
                  <p className="text-temple-sand/80">Trust Office</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-temple-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-temple-sand/80">dharamdhamtrust@gmail.com</p>
                  <p className="text-temple-sand/80">https://dharamdhamtrust.org</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-temple-saffron mt-0.5 flex-shrink-0" />
                <p className="text-temple-sand/80">
                  Yamraj Dham, Dhani Raju<br />
                  Ta. Taranagar, Dist. Churu<br />
                  Rajasthan-331023
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
              <Link href="/about" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - About Yamraj Dham
              </Link>
              <Link href="/donate" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Donate
              </Link>
              <Link href="/gallery" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
                - Gallery
              </Link>
              <Link href="/contact" className="block text-temple-sand/80 hover:text-temple-saffron transition-colors">
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
                  href="https://facebook.com/Yamrajdham" 
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
                  href="https://instagram.com/yamraj_dham" 
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
                  href="https://www.youtube.com/@yamraj_dham" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-temple-sand/80 hover:text-temple-saffron transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  <span className="text-sm">YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="https://x.com/yamraj_dham" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-temple-sand/80 hover:text-temple-saffron transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="text-sm">Twitter/X</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="https://threads.com/@yamraj_dham" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-temple-sand/80 hover:text-temple-saffron transition-colors"
                >
                  <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-black">@</span>
                  </div>
                  <span className="text-sm">Threads</span>
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
                    <p className="text-temple-sand/80">Account Name: DHARAM DHAM TRUST</p>
                    <p className="text-temple-sand/80">Regd. No.- RAJ-202401341007870</p>
                    <p className="text-temple-sand/80">12AA & 80G approved</p>
                    <p className="text-temple-sand/80">PAN No.: AAETD9289Q</p>
                    <p className="text-temple-sand/80">Temple Trust NGO Regd. by Government of India Trust Act, 1882</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-temple-saffron mb-2">UPI Details:</p>
                  <div className="bg-temple-charcoal/50 p-3 rounded border border-temple-gold/20">
                    <p className="text-temple-sand/80">Mobile: +91 96625 44676, +91 84273 83381</p>
                    <p className="text-temple-sand/80">Website: https://dharamdhamtrust.org</p>
                    <p className="text-temple-sand/80">Email ID: dharamdhamtrust@gmail.com</p>
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
              <span className="text-temple-saffron font-medium">DHARAM DHAM TRUST</span>
            </div>
            <p className="text-sm text-temple-sand/80">
              © 2025 DHARAM DHAM TRUST | All Rights Reserved
            </p>
            <p className="text-xs text-temple-sand/60 mt-1">
              Building Yamrajdham Temple with devotion, dedication, and divine blessings
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
