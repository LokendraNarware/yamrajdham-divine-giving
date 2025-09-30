import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | Dharam Dham Paavan Nagari Trust',
  description: 'Disclaimer for Dharam Dham Paavan Nagari Trust - Important information about the use of our website and services.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-charcoal via-temple-dark to-temple-charcoal">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-temple-saffron mb-4">
              Disclaimer
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
                  This disclaimer ("Disclaimer") is a legal statement that limits the liability of Dharam Dham Paavan Nagari Trust ("we," "our," or "us") regarding the use of our website and services. By accessing and using our website, you acknowledge and agree to the terms outlined in this Disclaimer.
                </p>
                <p>
                  Please read this Disclaimer carefully before using our website or making any donations.
                </p>
              </div>
            </section>

            {/* Website Information Disclaimer */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🌐</span>
                Website Information Disclaimer
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p className="text-temple-gold font-medium mb-2">Important Notice:</p>
                  <p>
                    The information provided on this website is for general informational purposes only. While we strive to keep the information up-to-date and accurate, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Content Accuracy:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Information may become outdated without notice</li>
                    <li>Errors or omissions may occur in content</li>
                    <li>Technical information may be simplified for general understanding</li>
                    <li>Religious interpretations are for informational purposes only</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Religious Content Disclaimer */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🕉️</span>
                Religious Content Disclaimer
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>
                  The religious content, spiritual guidance, and interpretations provided on this website are for educational and informational purposes only:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Religious interpretations may vary among individuals and traditions</li>
                  <li>Spiritual guidance is general in nature and not personalized advice</li>
                  <li>We respect all religious beliefs and do not claim exclusivity</li>
                  <li>Religious practices and beliefs are matters of personal faith</li>
                  <li>We encourage respectful dialogue about different perspectives</li>
                </ul>
                <p>
                  We do not guarantee specific spiritual outcomes or benefits from following any religious practices mentioned on our website.
                </p>
              </div>
            </section>

            {/* Financial Disclaimer */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">💰</span>
                Financial and Donation Disclaimer
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Donation Information:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>All donations are voluntary and non-refundable</li>
                    <li>Donation amounts are at the discretion of the donor</li>
                    <li>Tax benefits are subject to applicable laws and regulations</li>
                    <li>We provide receipts but cannot guarantee tax deductions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Project Funding:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Construction timelines are estimates and may vary</li>
                    <li>Project costs may change due to various factors</li>
                    <li>Funding priorities may shift based on needs</li>
                    <li>Progress updates are provided in good faith</li>
                  </ul>
                </div>
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p className="text-temple-gold font-medium mb-2">Important:</p>
                  <p>
                    We are not responsible for any financial losses or consequences arising from donations made through our website. Donors should consult with financial advisors regarding tax implications.
                  </p>
                </div>
              </div>
            </section>

            {/* Technical Disclaimer */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                Technical and Website Disclaimer
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Website Availability:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Website may be temporarily unavailable for maintenance</li>
                    <li>Technical issues may cause service interruptions</li>
                    <li>We do not guarantee 24/7 website availability</li>
                    <li>External factors may affect website performance</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Security:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>We implement security measures but cannot guarantee complete security</li>
                    <li>Users are responsible for their own device security</li>
                    <li>Third-party services may have their own security risks</li>
                    <li>Data transmission over the internet carries inherent risks</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Third-Party Content Disclaimer */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🔗</span>
                Third-Party Content and Links Disclaimer
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>
                  Our website may contain links to external websites and third-party content:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We do not endorse or guarantee the accuracy of third-party content</li>
                  <li>External websites have their own terms and privacy policies</li>
                  <li>We are not responsible for the content of linked websites</li>
                  <li>Third-party services may have different security standards</li>
                  <li>User interactions with third parties are at their own risk</li>
                </ul>
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p className="text-temple-gold font-medium mb-2">Note:</p>
                  <p>
                    We recommend reviewing the terms and privacy policies of any third-party websites you visit.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">⚖️</span>
                Limitation of Liability
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>
                  To the maximum extent permitted by law, Dharam Dham Paavan Nagari Trust shall not be liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Direct, indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Errors or omissions in website content</li>
                  <li>Technical failures or service interruptions</li>
                  <li>Third-party actions or content</li>
                  <li>Unauthorized access to user data</li>
                  <li>Reliance on website information</li>
                  <li>Delays in project completion or delivery</li>
                </ul>
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p className="text-temple-gold font-medium mb-2">Important:</p>
                  <p>
                    Our total liability shall not exceed the amount paid by you for our services, if any.
                  </p>
                </div>
              </div>
            </section>

            {/* No Warranty Disclaimer */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🚫</span>
                No Warranty Disclaimer
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>
                  We provide our website and services "as is" without any warranties, express or implied:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>No warranty of merchantability or fitness for a particular purpose</li>
                  <li>No warranty of non-infringement of third-party rights</li>
                  <li>No warranty of uninterrupted or error-free service</li>
                  <li>No warranty of security or protection against viruses</li>
                  <li>No warranty of accuracy or completeness of information</li>
                </ul>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                Indemnification
              </h2>
              <div className="text-temple-sand/90 leading-relaxed">
                <p>
                  You agree to indemnify, defend, and hold harmless Dharam Dham Paavan Nagari Trust, its trustees, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorney's fees) arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                  <li>Your use of the website or services</li>
                  <li>Your violation of these terms or applicable laws</li>
                  <li>Your violation of third-party rights</li>
                  <li>Any content you submit or post</li>
                </ul>
              </div>
            </section>

            {/* Force Majeure */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🌪️</span>
                Force Majeure
              </h2>
              <div className="text-temple-sand/90 leading-relaxed">
                <p>
                  We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                  <li>Natural disasters, acts of God, or weather conditions</li>
                  <li>War, terrorism, or civil unrest</li>
                  <li>Government actions or regulations</li>
                  <li>Technical failures of third-party services</li>
                  <li>Pandemics or public health emergencies</li>
                  <li>Labor disputes or strikes</li>
                </ul>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🏛️</span>
                Governing Law and Jurisdiction
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>
                  This Disclaimer shall be governed by and construed in accordance with the laws of India. Any disputes arising from this Disclaimer or your use of our website shall be subject to the exclusive jurisdiction of the courts in Rajasthan, India.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📞</span>
                Contact Information
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>If you have any questions about this Disclaimer, please contact us:</p>
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p><strong className="text-temple-gold">Dharam Dham Paavan Nagari Trust</strong></p>
                  <p>Email: info@dharamdhamtrust.org</p>
                  <p>Phone: +91 84273 83381</p>
                  <p>Address: Raju ki dhani, Yamrajdham Temple<br />
                  On road NH-52, Rajgarh Churu<br />
                  Taranagar, Rajasthan 331304</p>
                </div>
              </div>
            </section>

            {/* Updates to Disclaimer */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📝</span>
                Updates to Disclaimer
              </h2>
              <div className="text-temple-sand/90 leading-relaxed">
                <p>
                  We reserve the right to update this Disclaimer at any time. Changes will be posted on our website with an updated "Last Updated" date. Your continued use of our website after changes are posted constitutes acceptance of the updated Disclaimer.
                </p>
              </div>
            </section>

          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-temple-sand/60 text-sm">
              This Disclaimer is effective as of January 15, 2025. By using our website, you acknowledge that you have read and understood this Disclaimer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
