import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | DHARAM DHAM TRUST',
  description: 'Terms and Conditions for DHARAM DHAM TRUST - Read our terms of service and conditions for using our website and making donations.',
};

export default function TermsConditionsPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-temple-saffron mb-4">
              Terms & Conditions
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
                  Welcome to DHARAM DHAM TRUST's website. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.
                </p>
                <p>
                  If you do not agree to these Terms, please do not use our website or services.
                </p>
              </div>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">✅</span>
                Acceptance of Terms
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>
                  By accessing, browsing, or using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. These Terms constitute a legally binding agreement between you and DHARAM DHAM TRUST.
                </p>
                <p>
                  You represent that you are at least 18 years old and have the legal capacity to enter into this agreement.
                </p>
              </div>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🏛️</span>
                Description of Service
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>
                  DHARAM DHAM TRUST operates this website to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide information about Yamrajdham Temple and its construction</li>
                  <li>Accept donations for temple construction and maintenance</li>
                  <li>Share spiritual content and temple updates</li>
                  <li>Facilitate communication with devotees and supporters</li>
                  <li>Provide information about religious activities and events</li>
                </ul>
              </div>
            </section>

            {/* Donations */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">💰</span>
                Donations
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Donation Process:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>All donations are voluntary and non-refundable</li>
                    <li>Donations are used for temple construction, maintenance, and religious activities</li>
                    <li>We provide receipts for all donations</li>
                    <li>Tax benefits may be available as per applicable laws</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Payment Terms:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>All payments are processed securely through trusted payment gateways</li>
                    <li>We accept various payment methods including UPI, cards, and net banking</li>
                    <li>Transaction fees may apply as per payment gateway terms</li>
                    <li>Failed transactions will be automatically refunded</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">👤</span>
                User Conduct
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the website for any unlawful or prohibited purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the website</li>
                  <li>Upload or transmit harmful code, viruses, or malware</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect user information without permission</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">©️</span>
                Intellectual Property Rights
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>
                  All content on this website, including text, graphics, logos, images, and software, is the property of DHARAM DHAM TRUST or its content suppliers and is protected by copyright and other intellectual property laws.
                </p>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Permitted Use:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>View and download content for personal, non-commercial use</li>
                    <li>Share content for religious or educational purposes</li>
                    <li>Print content for personal reference</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Prohibited Use:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Commercial use without written permission</li>
                    <li>Modification or alteration of content</li>
                    <li>Distribution for commercial purposes</li>
                    <li>Removal of copyright notices</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Privacy and Data Protection */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🔒</span>
                Privacy and Data Protection
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  By using our website, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                Disclaimers
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Website Availability:</h3>
                  <p>
                    We strive to keep our website available 24/7, but we do not guarantee uninterrupted access. The website may be temporarily unavailable due to maintenance, technical issues, or circumstances beyond our control.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Information Accuracy:</h3>
                  <p>
                    While we make every effort to ensure the accuracy of information on our website, we do not warrant that all information is complete, accurate, or up-to-date.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Third-Party Content:</h3>
                  <p>
                    Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these external sites.
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
              <div className="text-foreground leading-relaxed space-y-4">
                <p>
                  To the maximum extent permitted by law, DHARAM DHAM TRUST shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use or inability to use the website</li>
                  <li>Unauthorized access to or alteration of your data</li>
                  <li>Any conduct or content of third parties</li>
                  <li>Any errors or omissions in the website content</li>
                  <li>Any loss of profits, data, or other intangible losses</li>
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
                  You agree to indemnify and hold harmless DHARAM DHAM TRUST, its trustees, employees, and agents from any claims, damages, losses, or expenses (including attorney's fees) arising from your use of the website or violation of these Terms.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🏛️</span>
                Governing Law and Jurisdiction
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of the website shall be subject to the exclusive jurisdiction of the courts in Rajasthan, India.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📝</span>
                Changes to Terms
              </h2>
              <div className="text-temple-sand/90 leading-relaxed">
                <p>
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the website after changes are posted constitutes acceptance of the modified Terms.
                </p>
              </div>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🔧</span>
                Severability
              </h2>
              <div className="text-temple-sand/90 leading-relaxed">
                <p>
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📞</span>
                Contact Information
              </h2>
              <div className="text-foreground leading-relaxed space-y-4">
                <p>If you have any questions about these Terms, please contact us:</p>
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p><strong className="text-temple-gold">DHARAM DHAM TRUST</strong></p>
                  <p>Email: info@dharamdhamtrust.org</p>
                  <p>Phone: +91 84273 83381</p>
                  <p>Address: Raju ki dhani, Yamrajdham Temple<br />
                  On road NH-52, Taranagar Churu<br />
                  Taranagar, Rajasthan 331304</p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              By using our website, you acknowledge that you have read and understood these Terms and agree to be bound by them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
