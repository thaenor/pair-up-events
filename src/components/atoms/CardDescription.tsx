import React from "react";
import { cn } from "@/lib/utils";

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-pairup-darkBlue/70", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

export default CardDescription;
