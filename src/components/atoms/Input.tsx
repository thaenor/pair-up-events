
import React from 'react';
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helper, 
  className,
  ...props 
}) => {
  console.log('Input rendered with props:', { label, error, helper });

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-pairup-cream">
          {label}
        </label>
      )}
      <ShadcnInput
        className={cn(
          "bg-pairup-darkBlueAlt border-pairup-darkBlueAlt text-pairup-cream",
          "focus:ring-2 focus:ring-pairup-cyan focus:border-transparent",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-pairup-cream/70">{helper}</p>
      )}
    </div>
  );
};

export default Input;
