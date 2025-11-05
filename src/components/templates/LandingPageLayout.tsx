import React from 'react'

import Footer from '../organisms/Landing/Footer'
import Navigation from '../organisms/Navigation/Navigation'
import MobileBottomNavigation from '../organisms/Navigation/MobileBottomNavigation'
interface LandingPageLayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
  showFooter?: boolean
}

const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({
  children,
  showNavigation = true,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen bg-pairup-cream">
      {showNavigation && <Navigation />}
      <main className="pb-20 md:pb-0">{children}</main>
      {showFooter && <Footer />}
      <MobileBottomNavigation />
    </div>
  )
}

export default LandingPageLayout
