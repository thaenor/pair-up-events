import type { MouseEvent } from "react";

import Logo from "../atoms/Logo";

type FooterLink = {
    label: string;
    targetId: string;
    ariaLabel: string;
};

const footerLinkGroups: Array<{
    heading: string;
    links: FooterLink[];
}> = [
    {
        heading: "Platform",
        links: [
            {
                label: "How it Works",
                targetId: "how-it-works",
                ariaLabel: "Navigate to the How it Works section",
            },
            {
                label: "Create an Event",
                targetId: "early-access",
                ariaLabel: "Learn how to create an event in the Early Access section",
            },
            {
                label: "Join an Event",
                targetId: "early-access",
                ariaLabel: "Join an event by signing up through the Early Access section",
            },
        ],
    },
    {
        heading: "Company",
        links: [
            {
                label: "About Us",
                targetId: "benefits",
                ariaLabel: "Discover more about Pair Up Events in the Benefits section",
            },
            {
                label: "Contact",
                targetId: "early-access",
                ariaLabel: "Find our contact form in the Early Access section",
            },
            {
                label: "Careers",
                targetId: "benefits",
                ariaLabel: "See why it's great to work with us in the Benefits section",
            },
        ],
    },
    {
        heading: "Legal",
        links: [
            {
                label: "Privacy Policy",
                targetId: "early-access",
                ariaLabel: "Review our upcoming privacy details in the Early Access section",
            },
            {
                label: "Terms of Service",
                targetId: "how-it-works",
                ariaLabel: "Understand how the service works in the How it Works section",
            },
            {
                label: "Cookie Policy",
                targetId: "benefits",
                ariaLabel: "Learn more about our approach in the Benefits section",
            },
        ],
    },
];

const Footer = () => {
    const handleLinkClick = (
        event: MouseEvent<HTMLAnchorElement>,
        targetId: string,
    ) => {
        event.preventDefault();

        document
            .getElementById(targetId)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <footer className="py-12 bg-pairup-darkBlue">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <Logo size="md" />
                        <p className="text-sm text-pairup-cream/70 mt-2">
                            You and your friend meet another pair for a shared
                            activity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                        {footerLinkGroups.map((group) => (
                            <div key={group.heading}>
                                <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">
                                    {group.heading}
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    {group.links.map((link) => (
                                        <li key={`${group.heading}-${link.label}`}>
                                            <a
                                                href={`#${link.targetId}`}
                                                onClick={(event) =>
                                                    handleLinkClick(
                                                        event,
                                                        link.targetId,
                                                    )
                                                }
                                                aria-label={link.ariaLabel}
                                                className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-pairup-darkBlueAlt/30 mt-12 pt-8 text-center text-sm text-pairup-cream/50">
                    &copy; 2025 Pair Up Events. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
