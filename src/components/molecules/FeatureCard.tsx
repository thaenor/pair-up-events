import React from "react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className
}) => {
  return (
    <div
      className={cn(
        "bg-white/20 p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-pairup-darkBlue">
        {title}
      </h3>
      <p className="text-pairup-darkBlue/80">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
