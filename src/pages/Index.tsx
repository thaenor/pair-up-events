import {
    BenefitsSection,
    EarlyAccessSection,
    HeroSection,
    HowItWorksSection,
    LandingPageLayout,
    SkipLink,
} from "@/components";
import { useScrollToElement } from "@/hooks/useScrollToElement";

const Index = () => {
    const { scrollToElement, createElementRef } = useScrollToElement();

    const handleScrollToEarlyAccess = () => {
        scrollToElement("early-access");
    };

    return (
        <LandingPageLayout>
            <SkipLink targetId="main-content" />
            <main id="main-content" role="main" aria-label="PairUp Events main content">
                <HeroSection onScrollToEarlyAccess={handleScrollToEarlyAccess} />
                <HowItWorksSection />
                <BenefitsSection />
                <div ref={createElementRef("early-access")}>
                    <EarlyAccessSection />
                </div>
            </main>
        </LandingPageLayout>
    );
};

export default Index;
