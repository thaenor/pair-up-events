import React from "react";

import Footer from "../organisms/Footer";
import Navigation from "../organisms/Navigation";
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
    const handleGetStarted = () => {
        document.getElementById("early-access")?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
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
