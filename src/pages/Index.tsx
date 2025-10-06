import {
    BenefitsSection,
    EarlyAccessSection,
    HeroSection,
    HowItWorksSection,
    LandingPageLayout,
    SkipLink,
} from "@/components";

const Index = () => {
    const handleScrollToEarlyAccess = () => {
        document.getElementById("early-access")?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

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
    );
};

export default Index;
