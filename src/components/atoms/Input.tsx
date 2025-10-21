import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "error" | "success";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  theme?: "light" | "dark";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      icon,
      iconPosition = "left",
      fullWidth = true,
      theme = "light",
      ...props
    },
    ref
  ) => {
    const baseClasses = theme === "dark" 
      ? "block w-full py-3 border rounded-md bg-pairup-darkBlue text-pairup-cream placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors"
      : "block w-full py-3 border rounded-md bg-white text-pairup-darkBlue placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors";

    const variantClasses = {
      default: "border-gray-500",
      error: "border-red-500",
      success: "border-green-500"
    };

    const widthClasses = fullWidth ? "w-full" : "";

    const paddingClasses = icon && iconPosition === "left" 
      ? "pl-10 pr-3" 
      : icon && iconPosition === "right" 
      ? "pl-3 pr-10" 
      : "px-3";

    return (
      <div className={cn("relative", widthClasses)}>
        {icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.isValidElement(icon) && icon.type?.displayName === "Icon" 
              ? React.cloneElement(icon as React.ReactElement<{ theme?: string }>, { theme })
              : icon
            }
          </div>
        )}
        <input
          className={cn(
            baseClasses,
            variantClasses[variant],
            paddingClasses,
            className
          )}
          ref={ref}
          aria-invalid={variant === "error"}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {React.isValidElement(icon) && icon.type?.displayName === "Icon" 
              ? React.cloneElement(icon as React.ReactElement<{ theme?: string }>, { theme })
              : icon
            }
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
