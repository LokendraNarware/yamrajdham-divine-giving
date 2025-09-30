import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | Dharam Dham Paavan Nagari Trust',
  description: 'View our temple construction progress, religious ceremonies, and community events in our photo gallery.',
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-charcoal via-temple-dark to-temple-charcoal">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-temple-saffron mb-4">
              Temple Gallery
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🕉️</span>
              <span className="text-temple-gold text-lg">Dharam Dham Paavan Nagari Trust</span>
            </div>
            <p className="text-temple-sand/80 text-lg max-w-2xl mx-auto">
              Witness the divine journey of Yamrajdham Temple construction and our community's spiritual moments
            </p>
          </div>

          {/* Gallery Sections */}
          <div className="space-y-12">
            
            {/* Construction Progress */}
            <section>
              <h2 className="text-3xl font-semibold text-temple-saffron mb-6 text-center">
                🏗️ Construction Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-4">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Foundation Work</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Foundation Phase</h3>
                  <p className="text-temple-sand/80 text-sm">Completed foundation work with reinforced concrete</p>
                </div>
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-4">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Ground Floor</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Ground Floor Construction</h3>
                  <p className="text-temple-sand/80 text-sm">Ground floor walls and pillars in progress</p>
                </div>
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-4">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Planning</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Future Phases</h3>
                  <p className="text-temple-sand/80 text-sm">First floor and dome construction planned</p>
                </div>
              </div>
            </section>

            {/* Religious Ceremonies */}
            <section>
              <h2 className="text-3xl font-semibold text-temple-saffron mb-6 text-center">
                🙏 Religious Ceremonies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-4">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Ground Breaking</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Bhoomi Pujan</h3>
                  <p className="text-temple-sand/80 text-sm">Sacred ground breaking ceremony</p>
                </div>
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-4">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Daily Prayers</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Daily Aarti</h3>
                  <p className="text-temple-sand/80 text-sm">Regular prayer sessions at the temple site</p>
                </div>
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-4">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Festivals</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Festival Celebrations</h3>
                  <p className="text-temple-sand/80 text-sm">Special religious festivals and events</p>
                </div>
              </div>
            </section>

            {/* Community Events */}
            <section>
              <h2 className="text-3xl font-semibold text-temple-saffron mb-6 text-center">
                👥 Community Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-4">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Donation Events</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Fundraising Events</h3>
                  <p className="text-temple-sand/80 text-sm">Community fundraising activities</p>
                </div>
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-4">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Volunteer Work</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Volunteer Activities</h3>
                  <p className="text-temple-sand/80 text-sm">Community members helping with temple work</p>
                </div>
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-4">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Cultural Programs</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Cultural Events</h3>
                  <p className="text-temple-sand/80 text-sm">Traditional music and dance performances</p>
                </div>
              </div>
            </section>

            {/* Temple Architecture */}
            <section>
              <h2 className="text-3xl font-semibold text-temple-saffron mb-6 text-center">
                🏛️ Temple Architecture
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-6">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Architectural Plans</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Design Plans</h3>
                  <p className="text-temple-sand/80 text-sm">Detailed architectural drawings and 3D models</p>
                </div>
                <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-6">
                  <div className="aspect-video bg-temple-gold/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-temple-sand/60">Artistic Elements</span>
                  </div>
                  <h3 className="text-temple-gold font-medium mb-2">Sacred Artwork</h3>
                  <p className="text-temple-sand/80 text-sm">Traditional Hindu architectural elements and sculptures</p>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center">
              <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-8">
                <h3 className="text-2xl font-semibold text-temple-saffron mb-4">
                  Share Your Temple Moments
                </h3>
                <p className="text-temple-sand/80 mb-6 max-w-2xl mx-auto">
                  Have photos from temple events or construction progress? Share them with our community to help document this sacred journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:gallery@dharamdhamtrust.org"
                    className="bg-temple-saffron text-white px-6 py-3 rounded-lg hover:bg-temple-gold transition-colors"
                  >
                    📧 Share Photos
                  </a>
                  <a 
                    href="/donate"
                    className="bg-temple-charcoal border border-temple-gold text-temple-gold px-6 py-3 rounded-lg hover:bg-temple-gold hover:text-temple-charcoal transition-colors"
                  >
                    💰 Support Construction
                  </a>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
