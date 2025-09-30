import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | DHARAM DHAM TRUST',
  description: 'Privacy Policy for DHARAM DHAM TRUST - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-temple-saffron mb-4">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🕉️</span>
              <span className="text-temple-gold text-lg">DHARAM DHAM TRUST</span>
            </div>
            <p className="text-muted-foreground text-lg">
              Last updated: January 15, 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-background rounded-xl border border-border p-8 space-y-8 shadow-sm">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📋</span>
                Introduction
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>
                  At DHARAM DHAM TRUST ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make donations to support the construction of Yamrajdham Temple.
                </p>
                <p>
                  We respect your privacy and are committed to handling your personal data in accordance with applicable data protection laws and regulations.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Information We Collect
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Personal Information:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name and contact information (email, phone number)</li>
                    <li>Address and location details</li>
                    <li>Donation amounts and payment information</li>
                    <li>Communication preferences</li>
                    <li>Website usage data and analytics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Technical Information:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>IP address and browser information</li>
                    <li>Device information and operating system</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Website interaction data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                How We Use Your Information
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>We use your personal information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Processing and acknowledging your donations</li>
                  <li>Sending donation receipts and tax certificates</li>
                  <li>Providing updates about temple construction progress</li>
                  <li>Responding to your inquiries and communications</li>
                  <li>Improving our website and services</li>
                  <li>Complying with legal and regulatory requirements</li>
                  <li>Sending newsletters and spiritual content (with your consent)</li>
                  <li>Preventing fraud and ensuring security</li>
                </ul>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🤝</span>
                Information Sharing and Disclosure
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>With payment processors to process donations</li>
                  <li>With service providers who assist in our operations</li>
                  <li>When required by law or legal process</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>With your explicit consent</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🔒</span>
                Data Security
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing through trusted providers</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">⚖️</span>
                Your Rights
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Right to access your personal data</li>
                  <li>Right to correct inaccurate information</li>
                  <li>Right to delete your personal data</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Right to withdraw consent</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information provided in the Contact Us section.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🍪</span>
                Cookies and Tracking Technologies
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>
                  We use cookies and similar technologies to enhance your experience on our website. Cookies help us:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Remember your preferences</li>
                  <li>Analyze website traffic and usage</li>
                  <li>Improve website functionality</li>
                  <li>Provide personalized content</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences. However, disabling cookies may affect website functionality.
                </p>
              </div>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🔗</span>
                Third-Party Links
              </h2>
              <div className="text-temple-sand/90 leading-relaxed">
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">👶</span>
                Children's Privacy
              </h2>
              <div className="text-temple-sand/90 leading-relaxed">
                <p>
                  Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
                </p>
              </div>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📝</span>
                Changes to This Privacy Policy
              </h2>
              <div className="text-temple-sand/90 leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website with a new "Last Updated" date.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📞</span>
                Contact Us
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p><strong className="text-temple-gold">DHARAM DHAM TRUST</strong></p>
                  <p>Email: privacy@dharamdhamtrust.org</p>
                  <p>Phone: +91 84273 83381</p>
                  <p>Address: Raju ki dhani, Yamrajdham Temple<br />
                  On road NH-52, Rajgarh Churu<br />
                  Taranagar, Rajasthan 331304</p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              This Privacy Policy is effective as of January 15, 2025, and will remain in effect except with respect to any changes in its provisions in the future.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


