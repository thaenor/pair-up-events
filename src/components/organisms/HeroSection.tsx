import { ArrowRight } from "lucide-react";
import React from "react";

interface HeroSectionProps {
    onCreateEvent?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = () => {
    return (
    <section className="relative min-h-screen flex items-center justify-center bg-pairup-cream md:mt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-20">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div
                        id="headline-cta"
                        className="animate-fade-in mt-16 sm:mt-64 md:mt-0 relative z-10"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            <span className="text-pairup-darkBlue font-bold">
                                Grab your friend
                            </span>
                            <br />
                            <span className="text-pairup-darkBlue font-normal">
                                and meet another pair.
                            </span>
                        </h1>
                        <p className="text-xl mb-8 text-pairup-darkBlue/90 max-w-lg">
                            Some activities are better as a group of 4.<br />
                            Create your listing and connect with like-minded
                            duos to meet up for shared experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                id="create-listing-btn"
                                href="https://forms.gle/F6xptEXPLA8wEpTp7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-cta btn-cta--cyan"
                            >
                                Create a new listing
                                <ArrowRight size={18} />
                            </a>
                            <button
                                id="search-listing-btn"
                                className="btn-cta btn-cta--yellow"
                                onClick={() => { document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' }); }}
                            >
                                Search for existing listings
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                    <div id="hero-image" className="relative w-full -mt-24 sm:-mt-10 md:mt-0 mt-10 animate-fade-in flex items-center justify-center"
                        style={{ animationDelay: "0.5s" }}
                    >
                        <picture className="w-full max-w-2xl">
                            <source srcSet="/image-web.png" type="image/webp" />
                            <img
                                src="/image-web.png"
                                alt="Two pairs meeting up for an activity"
                                className="w-full h-auto object-contain max-h-[420px] md:max-h-[560px]"
                                loading="lazy"
                                sizes="(min-width: 768px) 50vw, 100vw"
                            />
                        </picture>
                    </div>
                </div>
            </div>

            <div id="bouncy-thing" className="hidden md:flex absolute bottom-10 left-1/2 transform -translate-x-1/2 justify-center">
                <a
                    href="#how-it-works"
                    className="animate-bounce"
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    <div className="w-8 h-12 border-2 border-pairup-darkBlue/50 rounded-full flex justify-center">
                        <div className="w-2 h-2 bg-pairup-darkBlue/50 rounded-full mt-2"></div>
                    </div>
                </a>
            </div>
        </section>
    );
};

export default HeroSection;
