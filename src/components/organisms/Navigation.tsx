import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Compass, Calendar, MessageCircle, User, LogIn, UserPlus } from "lucide-react";

import { Button, Icon, Logo } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { NAVIGATION_COPY, NAVIGATION_MESSAGES } from "@/constants/navigation";

export interface NavigationProps {
    isLoggedIn?: boolean;
    onGetStarted?: () => void;
    onLogin?: () => void;
    onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = React.memo(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogin = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    const handleSignUp = useCallback(() => {
        navigate('/signup');
    }, [navigate]);

    const handleNavigateToProfile = useCallback(() => {
        navigate(NAVIGATION_COPY.AUTHENTICATED.PROFILE_ROUTE);
    }, [navigate]);

    const handleNavigateToEvents = useCallback(() => {
        navigate('/events');
    }, [navigate]);

    const handleNavigateToMessenger = useCallback(() => {
        navigate('/messenger');
    }, [navigate]);

    const handleNavigateToExplore = useCallback(() => {
        navigate('/');
    }, [navigate]);

    // Helper function to check if a route is active
    const isActiveRoute = useCallback((path: string) => {
        return location.pathname === path;
    }, [location.pathname]);

    const handleLogout = useCallback(async () => {
        setIsLoggingOut(true);
    try {
        await signOut();
        toast.success(NAVIGATION_MESSAGES.LOGOUT_SUCCESS);
    } catch {
        // Error is handled by AuthProvider and will be caught by ErrorBoundary if needed
        toast.error(NAVIGATION_MESSAGES.LOGOUT_ERROR);
    } finally {
        setIsLoggingOut(false);
    }
    }, [signOut]);

    return (
        <nav
            className="py-4 w-full absolute top-0 left-0 z-10 bg-pairup-darkBlue shadow-2xl"
            aria-label="Main navigation"
            data-testid="main-navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Logo size="md" />

                {user ? (
                    // Logged in user navigation
                    <>
                        <div className="hidden md:flex items-center gap-6" role="menubar">
                            <button
                                onClick={handleNavigateToExplore}
                                className={`flex items-center gap-2 text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1 relative ${
                                    isActiveRoute('/') ? 'font-bold' : ''
                                }`}
                                aria-label={NAVIGATION_COPY.AUTHENTICATED.EXPLORE_ARIA}
                                role="menuitem"
                            >
                                <Compass className="w-4 h-4" />
                                <span className={isActiveRoute('/') ? 'underline decoration-2 underline-offset-4' : ''}>
                                    {NAVIGATION_COPY.AUTHENTICATED.EXPLORE}
                                </span>
                            </button>
                            <button
                                onClick={handleNavigateToEvents}
                                className={`flex items-center gap-2 text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1 relative ${
                                    isActiveRoute('/events') ? 'font-bold' : ''
                                }`}
                                aria-label={NAVIGATION_COPY.AUTHENTICATED.MY_EVENTS_ARIA}
                                role="menuitem"
                            >
                                <Calendar className="w-4 h-4" />
                                <span className={isActiveRoute('/events') ? 'underline decoration-2 underline-offset-4' : ''}>
                                    {NAVIGATION_COPY.AUTHENTICATED.MY_EVENTS}
                                </span>
                            </button>
                            <button
                                onClick={handleNavigateToMessenger}
                                className={`flex items-center gap-2 text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1 relative ${
                                    isActiveRoute('/messenger') ? 'font-bold' : ''
                                }`}
                                aria-label={NAVIGATION_COPY.AUTHENTICATED.MESSENGER_ARIA}
                                role="menuitem"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span className={isActiveRoute('/messenger') ? 'underline decoration-2 underline-offset-4' : ''}>
                                    {NAVIGATION_COPY.AUTHENTICATED.MESSENGER}
                                </span>
                            </button>
                            <button
                                onClick={handleNavigateToProfile}
                                className={`flex items-center gap-2 text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1 relative ${
                                    isActiveRoute('/profile') ? 'font-bold' : ''
                                }`}
                                aria-label={NAVIGATION_COPY.AUTHENTICATED.MY_PROFILE_ARIA}
                                role="menuitem"
                            >
                                <User className="w-4 h-4" />
                                <span className={isActiveRoute('/profile') ? 'underline decoration-2 underline-offset-4' : ''}>
                                    {NAVIGATION_COPY.AUTHENTICATED.MY_PROFILE}
                                </span>
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-4 mr-4">
                            <Button
                                variant="primary"
                                size="md"
                                loading={isLoggingOut}
                                loadingText={NAVIGATION_COPY.ACTIONS.LOGGING_OUT}
                                onClick={handleLogout}
                                aria-label="Logout from your account"
                                data-testid="logout-button"
                            >
                                {NAVIGATION_COPY.ACTIONS.LOGOUT}
                            </Button>
                        </div>
                    </>
                ) : (
                    // Logged out user navigation
                    <>
                        <div className="hidden md:flex items-center gap-6" role="menubar">
                            <a
                                href="#how-it-works"
                                className="text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1"
                                aria-label={NAVIGATION_COPY.LINKS.HOW_IT_WORKS_ARIA}
                                role="menuitem"
                            >
                                {NAVIGATION_COPY.LINKS.HOW_IT_WORKS}
                            </a>
                            <a
                                href="#benefits"
                                className="text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1"
                                aria-label={NAVIGATION_COPY.LINKS.BENEFITS_ARIA}
                                role="menuitem"
                            >
                                {NAVIGATION_COPY.LINKS.BENEFITS}
                            </a>
                            <a
                                href="#early-access"
                                className="text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1"
                                aria-label={NAVIGATION_COPY.LINKS.EARLY_ACCESS_ARIA}
                                role="menuitem"
                            >
                                {NAVIGATION_COPY.LINKS.EARLY_ACCESS}
                            </a>
                        </div>

                        <div className="flex items-center justify-center gap-4 mr-4">
                            <Button
                                variant="ghost"
                                size="md"
                                onClick={handleLogin}
                                aria-label={NAVIGATION_COPY.CTA.LOGIN_ARIA_LABEL}
                                data-testid="login-button"
                            >
                                <Icon size="sm">
                                    <LogIn className="w-4 h-4" />
                                </Icon>
                                {NAVIGATION_COPY.CTA.LOGIN}
                            </Button>
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={handleSignUp}
                                aria-label={NAVIGATION_COPY.CTA.SIGN_UP_ARIA_LABEL}
                                data-testid="signup-button"
                            >
                                <Icon size="sm">
                                    <UserPlus className="w-4 h-4" />
                                </Icon>
                                {NAVIGATION_COPY.CTA.SIGN_UP}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
});

Navigation.displayName = 'Navigation';

export default Navigation;