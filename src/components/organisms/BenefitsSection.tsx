import { Calendar, Map, MapPin, Users } from "lucide-react";
import { FeatureCard, Section } from "@/components";

const benefits = [
    {
        icon: <Users className="h-12 w-12 text-pairup-darkblue" />,
        title: "Experience a Fresh 4-Way Dynamic",
        description:
            "Meet two new people together with your friend, creating balanced and comfortable social energy",
    },
    {
        icon: <Calendar className="h-12 w-12 text-pairup-darkblue" />,
        title: "Break Your Routine",
        description:
            "Step out of your comfort zone with spontaneous social adventures and new experiences",
    },
    {
        icon: <MapPin className="h-12 w-12 text-pairup-darkblue" />,
        title: "Feel Safe and Open",
        description:
            "Explore new energies and connections while staying with someone you trust",
    },
    {
        icon: <Map className="h-12 w-12 text-pairup-darkblue" />,
        title: "Grow Your Social Circle",
        description:
            "Expand your network through curated, shared experiences in your city",
    },
];

const BenefitsSection = () => {
    return (
        <Section
            id="benefits"
            title="Why Pair Up?"
            description="We're reimagining how people meet and connect, making it more comfortable and meaningful"
            background="cream"
        >
            <div className="grid md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => (
                    <FeatureCard
                        key={index}
                        icon={benefit.icon}
                        title={benefit.title}
                        description={benefit.description}
                    />
                ))}
            </div>
        </Section>
    );
};

export default BenefitsSection;
