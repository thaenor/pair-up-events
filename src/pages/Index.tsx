import BenefitsSection from '@/components/organisms/Landing/BenefitsSection'
import EarlyAccessSection from '@/components/organisms/Landing/EarlyAccessSection'
import HeroSection from '@/components/organisms/Landing/HeroSection'
import HowItWorksSection from '@/components/organisms/Landing/HowItWorksSection'
import LandingPageLayout from '@/components/templates/LandingPageLayout'
import SkipLink from '@/components/atoms/skip-link'

const Index = () => {
  const handleScrollToEarlyAccess = () => {
    document.getElementById('early-access')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <LandingPageLayout>
      <SkipLink targetId="main-content" />
      <main id="main-content" role="main" aria-label="PairUp Events main content">
        <HeroSection onScrollToEarlyAccess={handleScrollToEarlyAccess} />
        <HowItWorksSection />
        <BenefitsSection />
        <EarlyAccessSection />
      </main>
    </LandingPageLayout>
  )
}

export default Index
