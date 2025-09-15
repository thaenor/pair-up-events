import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "hero";
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = "md",
    className,
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case "xs":
                return "h-3 w-3";
            case "sm":
                return "h-4 w-4";
            case "md":
                return "h-6 w-6";
            case "lg":
                return "h-8 w-8";
            case "xl":
                return "h-12 w-12";
            case "xxl":
                return "h-16 w-16";
            case "xxxl":
                return "h-24 w-24";
            case "hero":
                return "h-64 w-64 md:h-80 md:w-80";
            default:
                return "h-6 w-6";
        }
    };

    return (
        <Loader2
            className={cn(
                "animate-spin text-pairup-cyan",
                getSizeClasses(),
                className
            )}
        />
    );
};

export default LoadingSpinner;
