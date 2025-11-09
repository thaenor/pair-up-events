import React from 'react'
import { Shield } from 'lucide-react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24 pb-20 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="PairUp Events" className="h-12 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2 flex items-center justify-center">
            <Shield className="h-8 w-8 mr-3 text-pairup-darkBlue" />
            Privacy Policy
          </h1>
          <p className="text-sm text-pairup-darkBlue/70 italic mb-6">Last updated: November 2025</p>
        </div>

        {/* Content */}
        <article>
          {/* Introduction */}
          <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-8">
            Thank you for being part of PairUp Events. Your privacy is very important to us. This Privacy Policy
            explains how we collect, use, and protect your personal information when you use our website and services.
          </p>

          {/* Section 1: Who We Are */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">1. Who We Are</h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              PairUp Events is a social event platform based in Germany. If you have any questions about this policy or
              how we handle your data, you can contact us at:{' '}
              <a
                href="mailto:hey@pairup-events.com"
                className="text-pairup-darkBlue hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-pairup-darkBlue"
              >
                hey@pairup-events.com
              </a>
            </p>
          </section>

          {/* Section 2: What Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">2. What Information We Collect</h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              We collect the following types of personal data when you use our website or sign up for our events:
            </p>
            <ul className="text-left text-pairup-darkBlue/80 space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Personal details:</strong> Your name and email address when you
                  register or subscribe to updates.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Usage data:</strong> Information on how you use our website,
                  including pages visited and actions taken.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Analytics data:</strong> We use analytics tools (e.g., Google
                  Analytics or Meta Pixel) to understand user behavior and improve our services.
                </span>
              </li>
            </ul>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              We do not collect sensitive personal data unless you voluntarily provide it.
            </p>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">3. How We Use Your Information</h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">We use your information to:</p>
            <ul className="text-left text-pairup-darkBlue/80 space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>Create and manage your account.</span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>Communicate with you about updates, events, or new features.</span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>Improve our website, services, and user experience.</span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>Send you marketing or promotional emails (only if you've opted in).</span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>Analyze website traffic and engagement through analytics tools.</span>
              </li>
            </ul>
          </section>

          {/* Section 4: Legal Basis for Processing */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">
              4. Legal Basis for Processing (Under GDPR)
            </h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              We process your personal data based on the following legal grounds:
            </p>
            <ul className="text-left text-pairup-darkBlue/80 space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Your consent,</strong> for receiving marketing emails or
                  participating in beta tests.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Legitimate interest,</strong> for improving our platform and
                  ensuring security.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Performance of a contract,</strong> when providing services you sign
                  up for (e.g., event participation).
                </span>
              </li>
            </ul>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              You can withdraw your consent at any time by contacting us at the email above.
            </p>
          </section>

          {/* Section 5: Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">5. Data Retention</h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              We keep your data only as long as necessary for the purposes described above or as required by law. When
              data is no longer needed, we delete or anonymize it securely.
            </p>
          </section>

          {/* Section 6: Cookies and Tracking Technologies */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">
              6. Cookies and Tracking Technologies
            </h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              We use cookies and similar technologies to improve your experience and collect anonymous analytics. You
              can disable cookies in your browser settings at any time.
            </p>
          </section>

          {/* Section 7: Sharing Your Data */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">7. Sharing Your Data</h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              We do not sell or share your personal data with third parties. We may use trusted service providers (e.g.,
              analytics or email tools) who process data on our behalf and comply with GDPR standards.
            </p>
          </section>

          {/* Section 8: Your Data Protection Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">8. Your Data Protection Rights</h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              Under the GDPR, you have the following rights:
            </p>
            <ul className="text-left text-pairup-darkBlue/80 space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Access:</strong> Request a copy of your personal data.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Correction:</strong> Request correction of inaccurate information.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Deletion:</strong> Ask us to delete your data ("right to be
                  forgotten").
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Restriction:</strong> Request limited processing of your data.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Objection:</strong> Object to processing based on legitimate
                  interests.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-pairup-darkBlue mr-2">•</span>
                <span>
                  <strong className="font-semibold">Data portability:</strong> Request transfer of your data to another
                  provider.
                </span>
              </li>
            </ul>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              To exercise these rights, please contact us at the email above.
            </p>
          </section>

          {/* Section 9: Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">9. Security</h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              We use appropriate technical and organizational measures to protect your data against unauthorized access,
              loss, or misuse. However, no system is completely secure, and you share data at your own risk.
            </p>
          </section>

          {/* Section 10: Changes to This Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal
              requirements. The latest version will always be available on our website with the date of the last update.
            </p>
          </section>

          {/* Section 11: Contact Us */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4 mt-8">11. Contact Us</h2>
            <p className="text-base text-pairup-darkBlue/90 leading-relaxed mb-4">
              If you have any questions, requests, or concerns about this Privacy Policy, please contact us at:{' '}
              <a
                href="mailto:hey@pairup-events.com"
                className="text-pairup-darkBlue hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-pairup-darkBlue"
              >
                hey@pairup-events.com
              </a>
              . Location: Germany
            </p>
          </section>
        </article>
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default PrivacyPolicyPage
