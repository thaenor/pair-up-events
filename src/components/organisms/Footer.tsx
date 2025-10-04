import Logo from "../atoms/Logo";

const Footer = () => {
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
                        <div>
                            <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">
                                Platform
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="#how-it-works"
                                        className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                                    >
                                        How it Works
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#benefits"
                                        className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                                    >
                                        Benefits
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#early-access"
                                        className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                                    >
                                        Early Access
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">
                                Company
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="#headline-cta"
                                        className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                                    >
                                        About Pair Up
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:hello@pairupevents.com"
                                        className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                                        aria-label="Email Pair Up Events"
                                    >
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:hello@pairupevents.com?subject=Careers%20at%20Pair%20Up%20Events"
                                        className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                                        aria-label="Email Pair Up Events about career opportunities"
                                    >
                                        Careers
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">
                                Legal
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="mailto:privacy@pairupevents.com?subject=Privacy%20Policy%20Request"
                                        className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                                        aria-label="Request the privacy policy via email"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:legal@pairupevents.com?subject=Terms%20of%20Service%20Inquiry"
                                        className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                                        aria-label="Request the terms of service via email"
                                    >
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:privacy@pairupevents.com?subject=Cookie%20Policy%20Inquiry"
                                        className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                                        aria-label="Request the cookie policy via email"
                                    >
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
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
