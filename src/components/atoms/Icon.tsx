import React from "react";
import { cn } from "@/lib/utils";

export interface IconProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  theme?: "light" | "dark";
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

const Icon: React.FC<IconProps> = ({
  children,
  size = "md",
  className,
  theme = "light",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = true,
  ...props
}) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4", 
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8"
  };

  const themeClasses = {
    light: "text-gray-500",
    dark: "text-gray-300"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        sizeClasses[size],
        themeClasses[theme],
        className
      )}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    >
      {children}
    </span>
  );
};

export default Icon;
