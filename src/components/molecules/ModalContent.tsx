import React from "react";
import { cn } from "@/lib/utils";

export type ModalContentProps = React.HTMLAttributes<HTMLDivElement>;

const ModalContent: React.FC<ModalContentProps> = ({ className, ...props }) => (
  <div
    className={cn("text-gray-700 leading-relaxed", className)}
    {...props}
  />
);

export default ModalContent;
