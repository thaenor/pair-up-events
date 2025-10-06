import React from "react";

import Footer from "../organisms/Footer";
import Navigation from "../organisms/Navigation";
import { useScrollToElement } from "@/hooks/useScrollToElement";

interface LandingPageLayoutProps {
    children: React.ReactNode;
    showNavigation?: boolean;
    showFooter?: boolean;
}

const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({
    children,
    showNavigation = true,
    showFooter = true,
}) => {
    const { scrollToElement } = useScrollToElement();

    const handleGetStarted = () => {
        scrollToElement("early-access");
    };

    return (
        <div className="min-h-screen bg-pairup-cream">
            {showNavigation && <Navigation onGetStarted={handleGetStarted} />}
            <main>{children}</main>
            {showFooter && <Footer />}
        </div>
    );
};

export default LandingPageLayout;
