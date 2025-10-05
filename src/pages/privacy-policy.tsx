import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Construction, Lock } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pairup-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="PairUp Events" className="h-12 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2 flex items-center justify-center">
            <Shield className="h-8 w-8 mr-3 text-pairup-cyan" />
            Privacy Policy
          </h1>
        </div>

        {/* Under Construction Message */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-8 mb-8 text-center">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Construction className="h-16 w-16 text-pairup-cyan" />
                <Lock className="h-8 w-8 text-pairup-darkBlue absolute -bottom-1 -right-1" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4">
              🔒 Privacy First! 🔒
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-pairup-darkBlue/80 mb-6">
              We're crafting a comprehensive Privacy Policy that puts your privacy and security first. Our legal eagles are working overtime to make sure everything is crystal clear!
            </p>

            <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-pairup-darkBlue mb-3">
                What We're Working On:
              </h3>
              <ul className="text-left text-pairup-darkBlue/80 space-y-2">
                <li className="flex items-start">
                  <span className="text-pairup-cyan mr-2">•</span>
                  How we collect and use your data
                </li>
                <li className="flex items-start">
                  <span className="text-pairup-cyan mr-2">•</span>
                  Your rights to access, update, and delete your information
                </li>
                <li className="flex items-start">
                  <span className="text-pairup-cyan mr-2">•</span>
                  How we protect your personal information
                </li>
                <li className="flex items-start">
                  <span className="text-pairup-cyan mr-2">•</span>
                  Cookie policy and tracking preferences
                </li>
                <li className="flex items-start">
                  <span className="text-pairup-cyan mr-2">•</span>
                  Third-party integrations and data sharing
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">
                🛡️ Our Privacy Promise (Even Before the Policy!)
              </h4>
              <p className="text-sm text-green-700">
                We will never sell your personal data, spam you with unwanted emails, or share your information without your explicit consent. Your privacy is sacred to us!
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Questions about your privacy? Feel free to reach out to us anytime. We're here to help! 💬
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-pairup-cyan text-pairup-darkBlue font-medium rounded-lg hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <Link
                to="/terms-of-service"
                className="inline-flex items-center px-6 py-3 border border-pairup-cyan text-pairup-cyan rounded-lg hover:bg-pairup-cyan/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan transition-colors"
              >
                View Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Fun Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Your privacy matters to us! 🛡️
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
