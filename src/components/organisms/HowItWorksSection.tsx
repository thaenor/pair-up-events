import { Calendar, MapPin, Users } from "lucide-react";

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
        <section
            id="how-it-works"
            className="py-16 md:py-24 px-4 md:px-8 bg-transparent"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">
                        How it Works
                    </h2>
                    <p className="text-lg text-pairup-darkBlue/80 max-w-2xl mx-auto">
                        Our platform makes it easy to expand your social circle
                        in a comfortable, low-pressure way
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="bg-white/30 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="mb-6">{step.icon}</div>
                            <h3 className="text-xl font-semibold mb-3">
                                {step.title}
                            </h3>
                            <p className="text-pairup-darkBlue/80">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
