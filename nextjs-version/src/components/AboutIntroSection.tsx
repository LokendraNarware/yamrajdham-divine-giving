const AboutIntroSection = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-temple-charcoal">
            Building a Divine Legacy
          </h2>
          <div className="w-24 h-1 bg-gradient-divine mx-auto mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-border/30">
              <h3 className="text-xl font-semibold mb-4 text-temple-charcoal">
                🌸 Our Sacred Purpose
              </h3>
              <p className="text-temple-grey leading-relaxed">
                DHARAM DHAM TRUST stands as a beacon of faith, dedicated to the construction of Yamrajdham Temple. We believe in creating a sacred space that serves not just as a place of worship, but as a center for spiritual growth, community service, and cultural preservation.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-temple-cream to-temple-peach rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">
                🛕 The Temple Vision
              </h3>
              <p className="text-white/90 leading-relaxed">
                Yamrajdham Temple will be more than just a structure—it will be a living testament to our devotion, a place where ancient wisdom meets modern service, and where every devotee finds peace, purpose, and spiritual fulfillment.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="/mataji.png" 
                alt="Divine Blessing" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gradient-divine text-white p-4 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm">Dedicated to Dharma</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg border border-border/30 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-temple-charcoal">
              🙏 Our Commitment
            </h3>
            <p className="text-lg text-temple-grey leading-relaxed">
              Every brick laid, every prayer offered, and every devotee served brings us closer to realizing our dream of a divine sanctuary that will inspire generations to come. We invite you to be part of this sacred journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutIntroSection;
