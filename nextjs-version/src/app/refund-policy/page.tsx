import { Metadata } from 'next';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Dharam Dham Paavan Nagari Trust',
  description: 'Refund and Cancellation Policy for Dharam Dham Paavan Nagari Trust - Learn about our refund procedures and cancellation terms for donations.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-temple-saffron mb-4">
              Refund & Cancellation Policy
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
                  At Dharam Dham Paavan Nagari Trust, we understand that circumstances may change, and you may need to cancel or request a refund for your donation. This Refund & Cancellation Policy outlines the terms and conditions under which refunds may be processed.
                </p>
                <p>
                  Please read this policy carefully before making a donation, as it forms part of our Terms and Conditions.
                </p>
              </div>
            </section>

            {/* General Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📜</span>
                General Refund Policy
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p className="text-temple-gold font-medium mb-2">Important Notice:</p>
                  <p>
                    Donations made to Dharam Dham Paavan Nagari Trust are generally considered final and non-refundable, as they are made voluntarily for charitable and religious purposes. However, we understand that exceptional circumstances may arise.
                  </p>
                </div>
                <p>
                  Refunds will only be considered in the following specific circumstances:
                </p>
              </div>
            </section>

            {/* Eligible Refund Scenarios */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">✅</span>
                Eligible Refund Scenarios
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">1. Technical Errors:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Duplicate donations due to system errors</li>
                    <li>Incorrect amount charged due to technical glitches</li>
                    <li>Payment processed multiple times accidentally</li>
                    <li>Failed donations that were incorrectly marked as successful</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">2. Fraudulent Donations:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Unauthorized use of payment methods</li>
                    <li>Identity theft or account compromise</li>
                    <li>Donations not authorized by the account holder</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">3. Processing Errors:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Wrong donation amount processed</li>
                    <li>Incorrect recipient or purpose</li>
                    <li>Payment gateway errors</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">4. Exceptional Circumstances:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Death of the donor (with proper documentation)</li>
                    <li>Severe financial hardship (case-by-case basis)</li>
                    <li>Legal requirements or court orders</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Non-Refundable Scenarios */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">❌</span>
                Non-Refundable Scenarios
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>The following scenarios are generally not eligible for refunds:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Change of mind after successful donation</li>
                  <li>Disagreement with temple policies or activities</li>
                  <li>Personal financial difficulties (unless exceptional circumstances)</li>
                  <li>Donations made during special campaigns or events</li>
                  <li>Anonymous donations without proper identification</li>
                  <li>Donations older than 30 days (unless exceptional circumstances)</li>
                  <li>Donations made through third-party platforms without proper documentation</li>
                </ul>
              </div>
            </section>

            {/* Refund Process */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">🔄</span>
                Refund Process
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Step 1: Submit Refund Request</h3>
                  <p>
                    Contact us within 7 days of the donation with the following information:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Donation ID or reference number</li>
                    <li>Donation amount and date</li>
                    <li>Payment method used</li>
                    <li>Reason for refund request</li>
                    <li>Supporting documentation (if applicable)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Step 2: Review Process</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>We will review your request within 5-7 business days</li>
                    <li>Additional documentation may be requested</li>
                    <li>We may contact you for clarification</li>
                    <li>Decision will be communicated via email</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Step 3: Refund Processing</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Approved refunds will be processed within 7-10 business days</li>
                    <li>Refunds will be credited to the original payment method</li>
                    <li>Processing time may vary based on payment method</li>
                    <li>You will receive confirmation once processed</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Refund Timeline */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">⏰</span>
                Refund Timeline
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-temple-gold font-medium mb-2">Request Submission:</h4>
                      <p className="text-sm">Within 7 days of donation</p>
                    </div>
                    <div>
                      <h4 className="text-temple-gold font-medium mb-2">Review Period:</h4>
                      <p className="text-sm">5-7 business days</p>
                    </div>
                    <div>
                      <h4 className="text-temple-gold font-medium mb-2">Processing Time:</h4>
                      <p className="text-sm">7-10 business days</p>
                    </div>
                    <div>
                      <h4 className="text-temple-gold font-medium mb-2">Total Time:</h4>
                      <p className="text-sm">12-24 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method Specific Refunds */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">💳</span>
                Payment Method Specific Information
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Credit/Debit Cards:</h3>
                  <p>
                    Refunds will appear on your statement within 7-10 business days. The exact timing depends on your bank's processing time.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">UPI Payments:</h3>
                  <p>
                    UPI refunds are typically processed within 2-3 business days and will reflect in your account immediately.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Net Banking:</h3>
                  <p>
                    Net banking refunds may take 5-7 business days to reflect in your account.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">Wallet Payments:</h3>
                  <p>
                    Refunds to digital wallets (Paytm, PhonePe, etc.) are usually processed within 24-48 hours.
                  </p>
                </div>
              </div>
            </section>

            {/* Partial Refunds */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">💰</span>
                Partial Refunds
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>
                  In certain circumstances, we may offer partial refunds instead of full refunds:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>When only a portion of the donation was processed incorrectly</li>
                  <li>When administrative fees need to be deducted</li>
                  <li>When the donor requests a partial refund</li>
                  <li>When funds have already been allocated to specific projects</li>
                </ul>
                <p>
                  Any partial refund will be clearly communicated to you with a detailed explanation.
                </p>
              </div>
            </section>

            {/* Documentation Required */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📄</span>
                Required Documentation
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">For All Refund Requests:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Donation receipt or confirmation email</li>
                    <li>Bank statement or payment proof</li>
                    <li>Valid identification document</li>
                    <li>Written explanation for refund request</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-temple-gold mb-2">For Fraudulent Donations:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Police complaint or FIR (if applicable)</li>
                    <li>Bank's fraud investigation report</li>
                    <li>Affidavit stating unauthorized donation</li>
                    <li>Any other relevant legal documents</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-temple-saffron mb-4 flex items-center gap-2">
                <span className="text-xl">📞</span>
                Contact for Refund Requests
              </h2>
              <div className="text-temple-sand/90 leading-relaxed space-y-4">
                <p>To submit a refund request, please contact us:</p>
                <div className="bg-temple-charcoal/30 p-4 rounded-lg border border-temple-gold/20">
                  <p><strong className="text-temple-gold">Dharam Dham Paavan Nagari Trust</strong></p>
                  <p>Email: refunds@dharamdhamtrust.org</p>
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
                  We reserve the right to modify this Refund & Cancellation Policy at any time. Changes will be posted on our website with an updated "Last Modified" date. Continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>

          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-temple-sand/60 text-sm">
              This policy is effective as of January 15, 2025. For any questions regarding refunds, please contact us at refunds@dharamdhamtrust.org.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
