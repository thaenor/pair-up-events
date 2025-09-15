import React from "react";

import { cn } from "@/lib/utils";

import LoadingSpinner from "../atoms/LoadingSpinner";

interface LoadingStateProps {
    message?: string;
    type?: "page" | "section" | "component" | "inline";
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "hero";
    className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
    message = "Loading...",
    type = "component",
    size = "md",
    className,
}) => {
    const containerClasses = {
        page: "min-h-screen bg-pairup-darkBlue",
        section: "min-h-[200px] rounded-lg border border-border bg-card",
        component: "min-h-[100px] rounded border border-border/50 bg-muted/50",
        inline: "py-4",
    };

    const getTextClasses = () => {
        switch (type) {
            case "page":
                return "text-lg";
            case "section":
                return "text-base";
            case "component":
                return "text-sm";
            case "inline":
                return "text-sm";
            default:
                return "text-sm";
        }
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3",
                containerClasses[type],
                className
            )}
        >
            <LoadingSpinner size={size} />
            <p
                className={cn(
                    "text-muted-foreground font-medium",
                    getTextClasses()
                )}
            >
                {message}
            </p>
        </div>
    );
};

export default LoadingState;
