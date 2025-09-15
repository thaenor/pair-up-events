import React from "react";

interface PageWrapperProps {
    children: React.ReactNode;
    isLoading?: boolean;
    loadingMessage?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    isLoading = false,
    loadingMessage = "Loading page...",
}) => {
    return (
        <div>
            {isLoading ? (
                <div className="min-h-screen bg-pairup-darkBlue flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pairup-cyan"></div>
                    <p className="text-muted-foreground font-medium text-lg">
                        {loadingMessage}
                    </p>
                </div>
            ) : (
                children
            )}
        </div>
    );
};

export default PageWrapper;
