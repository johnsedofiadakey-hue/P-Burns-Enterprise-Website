import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-gray-100">
          <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Legal</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111] mb-6">Privacy Policy</h1>
          <div className="w-16 h-1 bg-gold-500 mb-8"></div>

          <div className="prose prose-gray max-w-none text-gray-600 space-y-6 text-sm leading-relaxed">
            <p><strong>Last Updated: May 13, 2026</strong></p>
            
            <p>At P-Burns Enterprise, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you visit our website or use our services.</p>

            <h2 className="text-xl font-bold text-[#111111] mt-8 mb-4 uppercase tracking-tight">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you fill out a contact form, request a quote, or make a pre-order request. This information may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and phone number</li>
              <li>Billing and shipping address</li>
              <li>Project details and material requirements</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h2 className="text-xl font-bold text-[#111111] mt-8 mb-4 uppercase tracking-tight">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders and requests</li>
              <li>Communicate with you about your projects and orders</li>
              <li>Improve our website and services</li>
              <li>Send you updates, promotions, and news (if you opt-in)</li>
            </ul>

            <h2 className="text-xl font-bold text-[#111111] mt-8 mb-4 uppercase tracking-tight">3. Information Sharing</h2>
            <p>We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>

            <h2 className="text-xl font-bold text-[#111111] mt-8 mb-4 uppercase tracking-tight">4. Security</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>

            <h2 className="text-xl font-bold text-[#111111] mt-8 mb-4 uppercase tracking-tight">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="font-bold text-[#111111]">
              P-Burns Enterprise<br />
              Email: info@pburns.com<br />
              Phone: +233 537 749 190<br />
              Address: Sefwi Dwirase Western North, Ghana
            </p>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-100 text-center">
            <Link href="/" className="text-gold-600 font-bold hover:text-gold-500 transition-colors uppercase text-sm tracking-wider">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
