import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "error" | "success";
  fullWidth?: boolean;
  theme?: "light" | "dark";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      ? "block w-full py-3 px-3 border rounded-md bg-pairup-darkBlue text-pairup-cream placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors resize-none"
      : "block w-full py-3 px-3 border rounded-md bg-white text-pairup-darkBlue placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors resize-none";

    const variantClasses = {
      default: "border-gray-500",
      error: "border-red-500",
      success: "border-green-500"
    };

    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <div className={cn("relative", widthClasses)}>
        <textarea
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

Textarea.displayName = "Textarea";

export default Textarea;
