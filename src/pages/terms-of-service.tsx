import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Construction } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pairup-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="PairUp Events" className="h-12 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2 flex items-center justify-center">
            <FileText className="h-8 w-8 mr-3 text-pairup-cyan" />
            Terms of Service
          </h1>
        </div>

        {/* Under Construction Message */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-8 mb-8 text-center">
          <div className="mb-6">
            <Construction className="h-16 w-16 mx-auto text-pairup-cyan mb-4" />
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4">
              🚧 Under Construction! 🚧
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-pairup-darkBlue/80 mb-6">
              Our legal team is hard at work crafting the perfect Terms of Service that will protect both you and us while keeping things fair and simple.
            </p>

            <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-pairup-darkBlue mb-3">
                What to Expect:
              </h3>
              <ul className="text-left text-pairup-darkBlue/80 space-y-2">
                <li className="flex items-start">
                  <span className="text-pairup-cyan mr-2">•</span>
                  Clear, easy-to-understand language (no legal jargon!)
                </li>
                <li className="flex items-start">
                  <span className="text-pairup-cyan mr-2">•</span>
                  Your rights and our responsibilities
                </li>
                <li className="flex items-start">
                  <span className="text-pairup-cyan mr-2">•</span>
                  How we handle your data and privacy
                </li>
                <li className="flex items-start">
                  <span className="text-pairup-cyan mr-2">•</span>
                  Community guidelines for safe pairing
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              In the meantime, we promise to treat you with respect, protect your privacy, and create a safe space for pairs to connect and discover amazing events together! 🤝
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
                to="/privacy-policy"
                className="inline-flex items-center px-6 py-3 border border-pairup-cyan text-pairup-cyan rounded-lg hover:bg-pairup-cyan/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan transition-colors"
              >
                View Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Fun Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Made with ❤️ by the PairUp Events team
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
