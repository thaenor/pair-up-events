import React from "react";

import Footer from "../organisms/Footer";
import Navigation from "../organisms/Navigation";
import MobileBottomNavigation from "../organisms/MobileBottomNavigation";
import { useAuth } from "@/hooks/useAuth";
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
    const { user } = useAuth();
    
    const handleGetStarted = () => {
        document.getElementById("early-access")?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <div className="min-h-screen bg-pairup-cream">
            {showNavigation && <Navigation onGetStarted={handleGetStarted} />}
            <main className={user ? 'pb-20 md:pb-0' : ''}>{children}</main>
            {showFooter && <Footer />}
            {user && <MobileBottomNavigation />}
        </div>
    );
};

export default LandingPageLayout;
