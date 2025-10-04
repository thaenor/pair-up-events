import React from "react";

import { iframeURL } from "@/lib/config";
import { cn } from "@/lib/utils";

type EarlyAccessSectionProps = React.HTMLAttributes<HTMLElement>;

const EarlyAccessSection = React.forwardRef<HTMLElement, EarlyAccessSectionProps>(
    ({ className, ...props }, ref) => {
        return (
            <section
                id="early-access"
                ref={ref}
                className={cn(
                    "py-16 md:py-24 px-4 md:px-8 bg-transparent",
                    className
                )}
                {...props}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/30 p-12 rounded-3xl backdrop-blur-sm">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4">
                                Get Early Access
                            </h2>
                            <p className="text-lg text-pairup-darkBlue/80 max-w-2xl mx-auto">
                                Be the first to know when we launch. Sign up now to
                                receive exclusive updates, sneak peeks, and priority
                                access to Pair Up Events.
                            </p>
                        </div>

                        <div className="mx-auto w-full max-w-3xl">
                            <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
                                <div className="relative w-full aspect-[6/5]">
                                    <iframe
                                        src={iframeURL}
                                        title="Brevo Subscription Form"
                                        allowFullScreen
                                        scrolling="auto"
                                        className="absolute inset-0 h-full w-full rounded-2xl border-0"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
);

EarlyAccessSection.displayName = "EarlyAccessSection";

export default EarlyAccessSection;
