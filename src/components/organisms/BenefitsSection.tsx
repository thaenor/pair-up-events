import { Calendar, Map, MapPin, Users } from "lucide-react";

const benefits = [
    {
        icon: <Users className="h-12 w-12 text-pairup-yellow" />,
        title: "Experience a Fresh 4-Way Dynamic",
        description:
            "Meet two new people together with your friend, creating balanced and comfortable social energy",
    },
    {
        icon: <Calendar className="h-12 w-12 text-pairup-yellow" />,
        title: "Break Your Routine",
        description:
            "Step out of your comfort zone with spontaneous social adventures and new experiences",
    },
    {
        icon: <MapPin className="h-12 w-12 text-pairup-yellow" />,
        title: "Feel Safe and Open",
        description:
            "Explore new energies and connections while staying with someone you trust",
    },
    {
        icon: <Map className="h-12 w-12 text-pairup-yellow" />,
        title: "Grow Your Social Circle",
        description:
            "Expand your network through curated, shared experiences in your city",
    },
];

const BenefitsSection = () => {
    return (
        <section
            id="benefits"
            className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-br from-pairup-darkBlue to-pairup-darkBlueAlt"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why Pair Up?</h2>
                    <p className="text-lg text-pairup-cream/80 max-w-2xl mx-auto">
                        We're reimagining how people meet and connect, making it
                        more comfortable and meaningful
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-pairup-darkBlue/30 p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="mb-6">{benefit.icon}</div>
                            <h3 className="text-xl font-semibold mb-3">
                                {benefit.title}
                            </h3>
                            <p className="text-pairup-cream/80">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
