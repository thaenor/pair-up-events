import {
    BenefitsSection,
    EarlyAccessSection,
    HeroSection,
    HowItWorksSection,
    LandingPageLayout,
    SkipLink,
} from "@/components";

const Index = () => {
    return (
        <LandingPageLayout>
            <SkipLink targetId="main-content" />
            <main id="main-content" role="main" aria-label="PairUp Events main content">
                <HeroSection />
                <HowItWorksSection />
                <BenefitsSection />
                <EarlyAccessSection />
            </main>
        </LandingPageLayout>
    );
};

export default Index;
