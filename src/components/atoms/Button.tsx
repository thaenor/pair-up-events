
import React from 'react';
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-pairup-cyan text-pairup-darkBlue hover:opacity-90",
        secondary: "bg-pairup-yellow text-pairup-darkBlue hover:opacity-90",
        gradient: "relative text-pairup-darkBlue bg-gradient-to-r from-pairup-cyan to-pairup-yellow hover:bg-[length:200%_100%] hover:animate-[wave-animation_1s_infinite_linear]",
        outline: "relative text-pairup-cream bg-transparent border-2 border-transparent before:content-[''] before:absolute before:inset-0 before:rounded-[5px] before:p-[2px] before:bg-gradient-to-r before:from-pairup-cyan before:to-pairup-yellow before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude] before:pointer-events-none hover:before:bg-[length:200%_100%] hover:before:animate-[wave-animation_1s_infinite_linear]"
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  children,
  className,
  ...props
}) => {
  return (
    <button
      type={props.type || 'button'}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
export { buttonVariants };
