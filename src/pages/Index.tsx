import {
    BenefitsSection,
    EarlyAccessSection,
    HeroSection,
    HowItWorksSection,
    LandingPageLayout,
    PageWrapper,
} from "@/components";
import { useCallback, useRef } from "react";

const Index = () => {
    const earlyAccessRef = useRef<HTMLElement | null>(null);

    const handleScrollToEarlyAccess = useCallback(() => {
        earlyAccessRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <PageWrapper>
            <LandingPageLayout onGetStarted={handleScrollToEarlyAccess}>
                <HeroSection onGetStarted={handleScrollToEarlyAccess} />
                <HowItWorksSection />
                <BenefitsSection />
                <EarlyAccessSection ref={earlyAccessRef} />
            </LandingPageLayout>
        </PageWrapper>
    );
};

export default Index;
