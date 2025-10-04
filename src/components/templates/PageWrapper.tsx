import React from "react";

import LoadingState from "../molecules/LoadingState";

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
    if (isLoading) {
        return <LoadingState type="page" message={loadingMessage} />;
    }

    return <>{children}</>;
};

export default PageWrapper;
