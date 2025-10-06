import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Logo from "../atoms/Logo";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

export interface NavigationProps {
    isLoggedIn?: boolean;
    onGetStarted?: () => void;
    onLogin?: () => void;
    onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = React.memo(() => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleGetStarted = useCallback(() => {
        if (user) {
            // User is logged in, redirect to profile page
            navigate('/profile');
        } else {
            // User is not logged in, redirect to signup
            navigate('/signup');
        }
    }, [user, navigate]);

    const handleLogout = useCallback(async () => {
        setIsLoggingOut(true);
    try {
        await signOut();
        toast.success('Logged out successfully');
    } catch {
        // Error is handled by AuthProvider and will be caught by ErrorBoundary if needed
        toast.error('Failed to log out. Please try again.');
    } finally {
        setIsLoggingOut(false);
    }
    }, [signOut]);

    return (
        <nav
            className="py-4 w-full absolute top-0 left-0 z-10 bg-pairup-darkBlue shadow-2xl"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Logo size="md" />

                <div className="hidden md:flex items-center gap-6" role="menubar">
                    <a
                        href="#how-it-works"
                        className="text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1"
                        aria-label="Learn how Pair Up Events works"
                        role="menuitem"
                    >
                        How It Works
                    </a>
                    <a
                        href="#benefits"
                        className="text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1"
                        aria-label="Learn about the benefits of Pair Up Events"
                        role="menuitem"
                    >
                        Benefits
                    </a>
                    <a
                        href="#early-access"
                        className="text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1"
                        aria-label="Sign up for early access to Pair Up Events"
                        role="menuitem"
                    >
                        Early Access
                    </a>
                </div>

                <div className="flex items-center justify-center gap-4 mr-4">
                    {user ? (
                        // User is logged in
                        <>
                            <span className="text-pairup-cream text-sm" aria-live="polite">
                                Welcome, {user.displayName || user.email}
                            </span>
                            <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-6 py-3 text-base bg-pairup-cyan text-pairup-darkBlue hover:opacity-90"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                aria-label="Logout from your account"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                                        <span aria-live="polite">Logging out...</span>
                                    </>
                                ) : (
                                    'Logout'
                                )}
                            </button>
                        </>
                    ) : (
                        // User is not logged in
                        <button
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-6 py-3 text-base bg-pairup-cyan text-pairup-darkBlue hover:opacity-90"
                            onClick={handleGetStarted}
                            aria-label="Get started with Pair Up Events"
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
});

Navigation.displayName = 'Navigation';

export default Navigation;