import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donation Policy | Dharam Dham Paavan Nagari Trust',
  description: 'Donation Policy for Dharam Dham Paavan Nagari Trust - Learn about our donation guidelines, processes, and how your contributions are used.',
};

export default function DonationPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-charcoal via-temple-dark to-temple-charcoal">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-temple-saffron mb-4">
              Donation Policy
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🕉️</span>
              <span className="text-temple-gold text-lg">Dharam Dham Paavan Nagari Trust</span>
            </div>
            <p className="text-temple-sand/80 text-lg">
              Last updated: January 15, 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-temple-charcoal/50 backdrop-blur-sm rounded-xl border border-temple-gold/20 p-8 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📋</span>
                Introduction
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>
                  Welcome to Dharam Dham Paavan Nagari Trust's Donation Policy. This policy outlines our guidelines, processes, and commitments regarding donations made to support the construction and maintenance of Yamrajdham Temple.
                </p>
                <p>
                  We are grateful for your support and commitment to our mission of building a sacred space for spiritual growth and community service.
                </p>
              </div>
            </section>

            {/* Mission and Purpose */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Mission and Purpose
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>
                  Dharam Dham Paavan Nagari Trust is dedicated to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Building and maintaining Yamrajdham Temple</li>
                  <li>Preserving and promoting Hindu religious traditions</li>
                  <li>Providing spiritual guidance and community services</li>
                  <li>Supporting religious education and cultural activities</li>
                  <li>Helping those in need through charitable initiatives</li>
                  <li>Creating a sacred space for worship and meditation</li>
                </ul>
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p className="text-temple-gold font-medium mb-2">Our Commitment:</p>
                  <p>
                    Every donation received is used with the utmost care and transparency to further our mission and serve the community.
                  </p>
                </div>
              </div>
            </section>

            {/* Types of Donations */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">💰</span>
                Types of Donations
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">1. General Donations:</h3>
                  <p>
                    General donations support overall temple operations, maintenance, and various religious activities.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">2. Construction Donations:</h3>
                  <p>
                    Specifically allocated for temple construction, renovation, and infrastructure development.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">3. Special Purpose Donations:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Religious ceremonies and festivals</li>
                    <li>Educational programs and scholarships</li>
                    <li>Community service initiatives</li>
                    <li>Charitable activities and relief work</li>
                    <li>Religious artifacts and temple decorations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">4. Monthly/Recurring Donations:</h3>
                  <p>
                    Regular contributions to support ongoing temple operations and maintenance.
                  </p>
                </div>
              </div>
            </section>

            {/* Donation Guidelines */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📝</span>
                Donation Guidelines
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Donation Amounts:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>No minimum or maximum donation amount</li>
                    <li>All amounts are gratefully accepted</li>
                    <li>Donors can choose from suggested amounts or enter custom amounts</li>
                    <li>Large donations may be discussed for special recognition</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Donation Methods:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Online payments through our secure website</li>
                    <li>UPI payments (PhonePe, GooglePay, Paytm)</li>
                    <li>Credit and debit cards</li>
                    <li>Net banking</li>
                    <li>Direct bank transfers</li>
                    <li>Checks and demand drafts</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Donor Information:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Personal information is required for receipt generation</li>
                    <li>Anonymous donations are accepted but cannot receive tax benefits</li>
                    <li>Accurate contact information helps us provide updates</li>
                    <li>All donor information is kept confidential</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How Donations Are Used */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🏗️</span>
                How Donations Are Used
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Construction and Infrastructure (70%):</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Temple building construction</li>
                    <li>Foundation and structural work</li>
                    <li>Electrical and plumbing systems</li>
                    <li>Landscaping and parking areas</li>
                    <li>Safety and security systems</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Operations and Maintenance (20%):</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Daily temple operations</li>
                    <li>Utilities and maintenance</li>
                    <li>Staff salaries and benefits</li>
                    <li>Religious ceremonies and festivals</li>
                    <li>Community service programs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Administrative and Fundraising (10%):</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Administrative expenses</li>
                    <li>Communication and marketing</li>
                    <li>Fundraising activities</li>
                    <li>Legal and accounting services</li>
                    <li>Technology and website maintenance</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Transparency and Accountability */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Transparency and Accountability
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Financial Reporting:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Annual financial reports are published</li>
                    <li>Quarterly progress updates are provided</li>
                    <li>Donation receipts are issued for all contributions</li>
                    <li>Audited financial statements are available upon request</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Project Updates:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Regular construction progress reports</li>
                    <li>Photo and video updates of temple development</li>
                    <li>Milestone celebrations and ceremonies</li>
                    <li>Community impact stories and testimonials</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Donor Recognition:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Donor acknowledgment (with permission)</li>
                    <li>Special recognition for significant contributions</li>
                    <li>Annual donor appreciation events</li>
                    <li>Memorial plaques for major donors</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Tax Benefits */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🧾</span>
                Tax Benefits and Receipts
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p className="text-temple-gold font-medium mb-2">Tax-Exempt Status:</p>
                  <p>
                    Dharam Dham Paavan Nagari Trust is registered as a charitable trust and may be eligible for tax exemptions under applicable Indian tax laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Receipts and Documentation:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Official donation receipts are provided for all contributions</li>
                    <li>Receipts include trust registration details</li>
                    <li>Annual consolidated receipts for recurring donors</li>
                    <li>Digital receipts sent via email immediately</li>
                    <li>Physical receipts available upon request</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Tax Consultation:</h3>
                  <p>
                    We recommend consulting with a tax advisor to understand the specific tax benefits available to you based on your individual circumstances and applicable tax laws.
                  </p>
                </div>
              </div>
            </section>

            {/* Donor Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🔒</span>
                Donor Privacy and Confidentiality
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Privacy Protection:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Donor information is kept strictly confidential</li>
                    <li>Personal details are not shared with third parties</li>
                    <li>Anonymous donations are respected and protected</li>
                    <li>Opt-out options for communications are available</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Communication Preferences:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Donors can choose their communication preferences</li>
                    <li>Email updates about temple progress</li>
                    <li>Newsletter subscriptions are optional</li>
                    <li>Event invitations and special announcements</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Special Donation Programs */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">⭐</span>
                Special Donation Programs
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Memorial Donations:</h3>
                  <p>
                    Honor the memory of loved ones through special memorial donations. These contributions help fund specific temple elements or programs.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Corporate Sponsorships:</h3>
                  <p>
                    Businesses can support temple construction through corporate sponsorship programs with special recognition opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Planned Giving:</h3>
                  <p>
                    Long-term giving options including bequests, trusts, and other planned giving vehicles for major supporters.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">In-Kind Donations:</h3>
                  <p>
                    We accept donations of materials, services, and expertise that support temple construction and operations.
                  </p>
                </div>
              </div>
            </section>

            {/* Donation Process */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🔄</span>
                Donation Process
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Online Donations:</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Select donation amount and purpose</li>
                    <li>Fill in donor information</li>
                    <li>Choose payment method</li>
                    <li>Complete secure payment</li>
                    <li>Receive instant receipt via email</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Offline Donations:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Contact us for bank details</li>
                    <li>Make direct bank transfer or send check</li>
                    <li>Email transaction details for receipt</li>
                    <li>Receive official receipt within 5 business days</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📞</span>
                Contact for Donations
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>For donation-related inquiries, please contact us:</p>
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p><strong className="text-temple-gold">Dharam Dham Paavan Nagari Trust</strong></p>
                  <p>Email: donations@dharamdhamtrust.org</p>
                  <p>Phone: +91 84273 83381</p>
                  <p>Address: Raju ki dhani, Yamrajdham Temple<br />
                  On road NH-52, Rajgarh Churu<br />
                  Taranagar, Rajasthan 331304</p>
                  <p className="mt-2 text-sm text-temple-sand/80">
                    <strong>Business Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM (IST)
                  </p>
                </div>
              </div>
            </section>

            {/* Policy Updates */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📝</span>
                Policy Updates
              </h2>
              <div className="text-temple-sand/90 leading-relaxed">
                <p>
                  This Donation Policy may be updated from time to time to reflect changes in our practices or legal requirements. Updated policies will be posted on our website with a new "Last Updated" date. Significant changes will be communicated to donors via email.
                </p>
              </div>
            </section>

          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-temple-sand/60 text-sm">
              Thank you for your generous support in helping us build Yamrajdham Temple. Together, we can create a sacred space that will serve our community for generations to come.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
