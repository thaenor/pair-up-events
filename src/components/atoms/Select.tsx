import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: "default" | "error" | "success";
  fullWidth?: boolean;
  theme?: "light" | "dark";
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant = "default",
      fullWidth = true,
      theme = "light",
      ...props
    },
    ref
  ) => {
    const baseClasses = theme === "dark" 
      ? "block w-full py-3 px-3 border rounded-md bg-pairup-darkBlue text-pairup-cream focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors"
      : "block w-full py-3 px-3 border rounded-md bg-white text-pairup-darkBlue focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors";

    const variantClasses = {
      default: "border-gray-500",
      error: "border-red-500",
      success: "border-green-500"
    };

    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <div className={cn("relative", widthClasses)}>
        <select
          className={cn(
            baseClasses,
            variantClasses[variant],
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
