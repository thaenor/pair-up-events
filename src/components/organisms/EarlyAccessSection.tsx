import { iframeURL } from "@/lib/config";
import { Section } from "@/components";

const EarlyAccessSection = () => {
    return (
        <Section
            id="early-access"
            background="transparent"
        >
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

                <div className="flex items-center justify-center">
                    <iframe
                        width="600"
                        height="500"
                        src={iframeURL}
                        frameBorder="0"
                        scrolling="auto"
                        allowFullScreen
                        style={{
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                        title="Brevo Subscription Form"
                    ></iframe>
                </div>
            </div>
        </Section>
    );
};

export default EarlyAccessSection;
