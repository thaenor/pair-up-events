import { Calendar, MapPin, Users } from "lucide-react";
import { FeatureCard, Section } from "@/components";

const steps = [
    {
        icon: <Calendar className="h-12 w-12 text-pairup-darkblue" />,
        title: (
            <span>
                <span className="text-pairup-darkblue">Create</span> or{" "}
                <span className="text-pairup-darkblue">Join</span>
            </span>
        ),
        description:
            "Create your own event or browse existing ones in your area",
    },
    {
        icon: <Users className="h-12 w-12 text-pairup-darkblue" />,
        title: "Find a Friend",
        description:
            "Start by selecting one friend to join your pair-up adventure",
    },
    {
        //TODO: add <Logo size="xl" showText={false} />
        icon: <MapPin className="h-12 w-12 text-pairup-darkblue" />,
        title: 'Meet Up',
        description:
            "Connect with another pair at the agreed location and enjoy!",
    },
];

const HowItWorksSection = () => {
    return (
        <Section
            id="how-it-works"
            title="How it Works"
            description="Our platform makes it easy to expand your social circle in a comfortable, low-pressure way"
            background="transparent"
        >
            <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <FeatureCard
                        key={index}
                        icon={step.icon}
                        title={step.title}
                        description={step.description}
                        className="bg-white/30"
                    />
                ))}
            </div>
        </Section>
    );
};

export default HowItWorksSection;
