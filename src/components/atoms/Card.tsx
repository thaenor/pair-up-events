import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "rounded-lg border border-gray-200 bg-white text-pairup-darkBlue shadow-sm",
      glass: "rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm text-pairup-darkBlue shadow-sm"
    };

    return (
      <div
        ref={ref}
        className={cn(variantClasses[variant], "p-6 transition-all duration-300", className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export default Card;
