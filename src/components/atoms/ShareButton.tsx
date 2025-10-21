import React from "react";
import { cn } from "@/lib/utils";

export interface ShareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "copy" | "share";
  onCopy?: () => Promise<void>;
  onShare?: () => Promise<void>;
  loading?: boolean;
  loadingText?: string;
}

const ShareButton = React.forwardRef<HTMLButtonElement, ShareButtonProps>(
  (
    {
      className,
      variant = "copy",
      onCopy,
      onShare,
      loading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pairup-cyan disabled:pointer-events-none disabled:opacity-60";

    const variantClasses = {
      copy: "px-3 py-2 text-pairup-darkBlue border border-gray-300 hover:bg-gray-50 focus-visible:ring-pairup-cyan/50",
      share: "px-3 py-2 text-white bg-pairup-cyan hover:bg-pairup-cyan/90 focus-visible:ring-pairup-cyan/50"
    };

    const handleClick = async () => {
      if (loading) return;
      
      if (variant === "copy" && onCopy) {
        await onCopy();
      } else if (variant === "share" && onShare) {
        await onShare();
      }
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true" />
            {loadingText || "Loading..."}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

ShareButton.displayName = "ShareButton";

export default ShareButton;
