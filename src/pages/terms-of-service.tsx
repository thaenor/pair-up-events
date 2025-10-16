import React from 'react'
import { FileText } from 'lucide-react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24 pb-20 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="PairUp Events" className="h-12 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2 flex items-center justify-center">
            <FileText className="h-8 w-8 mr-3 text-pairup-cyan" />
            Terms of Service
          </h1>
        </div>
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default TermsOfServicePage
