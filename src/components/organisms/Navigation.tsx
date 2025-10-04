import React from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../atoms/Logo";
import { useAuth } from "@/hooks/useAuth";

export interface NavigationProps {
    isLoggedIn?: boolean;
    onGetStarted?: () => void;
    onLogin?: () => void;
    onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleGetStarted = () => {
        if (user) {
            // User is logged in, redirect to dashboard or profile
            navigate('/dashboard');
        } else {
            // User is not logged in, redirect to login
            navigate('/login');
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    return (
        <nav
            className="py-4 w-full absolute top-0 left-0 z-10 bg-pairup-darkBlue shadow-2xl"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Logo size="md" />

                <div className="hidden md:flex items-center gap-6">
                    <a
                        href="#how-it-works"
                        className="text-pairup-cream hover:text-pairup-yellow duration-300"
                        aria-label="Learn how Pair Up Events works"
                    >
                        How It Works
                    </a>
                    <a
                        href="#benefits"
                        className="text-pairup-cream hover:text-pairup-yellow duration-300"
                    >
                        Benefits
                    </a>
                    <a
                        href="#early-access"
                        className="text-pairup-cream hover:text-pairup-yellow duration-300"
                        aria-label="Sign up for early access to Pair Up Events"
                    >
                        Early Access
                    </a>
                </div>

                <div className="flex items-center justify-center gap-4 mr-4">
                    {user ? (
                        // User is logged in
                        <>
                            <span className="text-pairup-cream text-sm">
                                Welcome, {user.displayName || user.email}
                            </span>
                            <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-6 py-3 text-base bg-pairup-cyan text-pairup-darkBlue hover:opacity-90"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        // User is not logged in
                        <button
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-6 py-3 text-base bg-pairup-cyan text-pairup-darkBlue hover:opacity-90"
                            onClick={handleGetStarted}
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
