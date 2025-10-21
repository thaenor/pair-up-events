import React from "react";
import { cn } from "@/lib/utils";

export type ModalActionsProps = React.HTMLAttributes<HTMLDivElement>;

const ModalActions: React.FC<ModalActionsProps> = ({ className, ...props }) => (
  <div
    className={cn("flex space-x-3 pt-6 border-t border-gray-200", className)}
    {...props}
  />
);

export default ModalActions;
