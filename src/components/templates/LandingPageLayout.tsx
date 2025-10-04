import React from "react";

import Footer from "../organisms/Footer";
import Navigation from "../organisms/Navigation";

interface LandingPageLayoutProps {
    children: React.ReactNode;
    showNavigation?: boolean;
    showFooter?: boolean;
    onGetStarted?: () => void;
}

const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({
    children,
    showNavigation = true,
    showFooter = true,
    onGetStarted,
}) => {
    return (
        <div className="min-h-screen bg-pairup-cream">
            {showNavigation && <Navigation onGetStarted={onGetStarted} />}
            <main>{children}</main>
            {showFooter && <Footer />}
        </div>
    );
};

export default LandingPageLayout;
