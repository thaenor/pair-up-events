import React from "react";
import { cn } from "@/lib/utils";
import Input from "../atoms/Input";

export interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children?: React.ReactNode;
  errorTestId?: string;
  theme?: "light" | "dark";
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  helpText,
  required = false,
  icon,
  iconPosition = "left",
  className,
  children,
  errorTestId,
  theme = "light"
}) => {
  const inputVariant = error ? "error" : "default";
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ");

  const labelClasses = theme === "dark" 
    ? "block text-sm font-medium text-pairup-cream" 
    : "block text-sm font-medium text-pairup-darkBlue";

  return (
    <div className={cn("space-y-2", className)}>
      <label 
        htmlFor={id} 
        className={labelClasses}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      {children ? (
        children
      ) : (
        <Input
          id={id}
          variant={inputVariant}
          icon={icon}
          iconPosition={iconPosition}
          theme={theme}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
        />
      )}
      
      {helpText && (
        <div id={helpId} className="sr-only">
          {helpText}
        </div>
      )}
      
      {error && (
        <p
          id={errorId}
          className="text-red-400 text-sm"
          role="alert"
          data-testid={errorTestId || `${id}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
