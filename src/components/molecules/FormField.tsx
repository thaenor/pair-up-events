
import React from 'react';
import Input from '../atoms/Input';
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'textarea';
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  helper?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  type = 'text',
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  helper
}) => {
  console.log('FormField rendered:', { label, type, value: value?.substring(0, 20) });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  if (type === 'textarea') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-pairup-cream">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "bg-pairup-darkBlueAlt border-pairup-darkBlueAlt text-pairup-cream",
            "focus:ring-2 focus:ring-pairup-cyan focus:border-transparent min-h-[100px]",
            error && "border-red-500"
          )}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {helper && !error && <p className="text-sm text-pairup-cream/70">{helper}</p>}
      </div>
    );
  }

  return (
    <Input
      type={type}
      label={`${label}${required ? ' *' : ''}`}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={error}
      helper={helper}
    />
  );
};

export default FormField;
