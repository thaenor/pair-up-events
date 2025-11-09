import BenefitsSection from '@/components/organisms/Landing/BenefitsSection'
import HeroSection from '@/components/organisms/Landing/HeroSection'
import HowItWorksSection from '@/components/organisms/Landing/HowItWorksSection'
import LandingPageLayout from '@/components/templates/LandingPageLayout'
import SkipLink from '@/components/atoms/skip-link'

const Index = () => {
  return (
    <LandingPageLayout>
      <SkipLink targetId="main-content" />
      <main id="main-content" role="main" aria-label="PairUp Events main content">
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
      </main>
    </LandingPageLayout>
  )
}

export default Index
