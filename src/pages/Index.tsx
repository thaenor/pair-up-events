import {
    BenefitsSection,
    EarlyAccessSection,
    HeroSection,
    HowItWorksSection,
    LandingPageLayout,
    PageWrapper,
} from "@/components";

const Index = () => {
    return (
        <PageWrapper>
            <LandingPageLayout>
                <HeroSection />
                <HowItWorksSection />
                <BenefitsSection />
                <EarlyAccessSection />
            </LandingPageLayout>
        </PageWrapper>
    );
};

export default Index;
