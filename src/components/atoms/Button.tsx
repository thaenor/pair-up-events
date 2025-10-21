import React from "react";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

    const variantClasses = {
      primary: "bg-pairup-cyan text-pairup-darkBlue hover:opacity-90 focus:ring-pairup-cyan/50",
      secondary: "bg-pairup-yellow text-pairup-darkBlue hover:opacity-90 focus:ring-pairup-yellow/50",
      outline: "border border-pairup-cyan text-pairup-cyan hover:bg-pairup-cyan hover:text-pairup-darkBlue focus:ring-pairup-cyan/50",
      ghost: "text-pairup-cream hover:text-pairup-cyan hover:bg-pairup-cyan/10 focus:ring-pairup-cyan/50",
      destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50"
    };

    const sizeClasses = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 py-2 text-base",
      lg: "h-12 px-6 py-3 text-lg"
    };

    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          widthClasses,
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <LoadingSpinner 
            size="sm" 
            className="mr-2" 
            aria-hidden="true" 
          />
        )}
        {loading ? (loadingText || "Loading...") : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
