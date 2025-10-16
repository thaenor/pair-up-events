import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Compass, Calendar, MessageCircle, User } from "lucide-react";

import { NAVIGATION_COPY } from "@/constants/navigation";

const MobileBottomNavigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper function to check if a route is active
    const isActiveRoute = useCallback((path: string) => {
        return location.pathname === path;
    }, [location.pathname]);

    const handleNavigateToExplore = useCallback(() => {
        navigate('/');
    }, [navigate]);

    const handleNavigateToEvents = useCallback(() => {
        navigate('/events');
    }, [navigate]);

    const handleNavigateToMessenger = useCallback(() => {
        navigate('/messenger');
    }, [navigate]);

    const handleNavigateToProfile = useCallback(() => {
        navigate('/profile');
    }, [navigate]);

    const navigationItems = [
        {
            label: NAVIGATION_COPY.AUTHENTICATED.EXPLORE,
            icon: Compass,
            onClick: handleNavigateToExplore,
            path: '/',
            ariaLabel: NAVIGATION_COPY.AUTHENTICATED.EXPLORE_ARIA,
        },
        {
            label: NAVIGATION_COPY.AUTHENTICATED.MY_EVENTS,
            icon: Calendar,
            onClick: handleNavigateToEvents,
            path: '/events',
            ariaLabel: NAVIGATION_COPY.AUTHENTICATED.MY_EVENTS_ARIA,
        },
        {
            label: NAVIGATION_COPY.AUTHENTICATED.MESSENGER,
            icon: MessageCircle,
            onClick: handleNavigateToMessenger,
            path: '/messenger',
            ariaLabel: NAVIGATION_COPY.AUTHENTICATED.MESSENGER_ARIA,
        },
        {
            label: NAVIGATION_COPY.AUTHENTICATED.MY_PROFILE,
            icon: User,
            onClick: handleNavigateToProfile,
            path: '/profile',
            ariaLabel: NAVIGATION_COPY.AUTHENTICATED.MY_PROFILE_ARIA,
        },
    ];

    return (
        <nav 
            className="fixed bottom-0 left-0 right-0 z-50 bg-pairup-darkBlue border-t border-pairup-cyan/20 md:hidden"
            aria-label="Mobile navigation"
            data-testid="mobile-bottom-navigation"
        >
            <div className="flex items-center justify-around py-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.path);
                    
                    return (
                        <button
                            key={item.path}
                            onClick={item.onClick}
                            className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors duration-200 ${
                                isActive 
                                    ? 'text-pairup-yellow' 
                                    : 'text-pairup-cream hover:text-pairup-yellow'
                            }`}
                            aria-label={item.ariaLabel}
                            role="menuitem"
                        >
                            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-pairup-yellow' : ''}`} />
                            <span className={`text-xs font-medium truncate ${isActive ? 'text-pairup-yellow' : ''}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-pairup-yellow rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNavigation;
