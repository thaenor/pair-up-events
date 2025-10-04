import {
    BenefitsSection,
    EarlyAccessSection,
    HeroSection,
    HowItWorksSection,
    LandingPageLayout,
} from "@/components";

const Index = () => {
    return (
        <LandingPageLayout>
            <HeroSection />
            <HowItWorksSection />
            <BenefitsSection />
            <EarlyAccessSection />
        </LandingPageLayout>
    );
};

export default Index;
