import { Home } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PageWrapper } from "@/components";

const NotFound = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Log 404 errors for monitoring (in production, send to error reporting service)
        if (process.env.NODE_ENV === "development") {
            console.warn(`404 Error: Route not found - ${location.pathname}`);
        }
    }, [location.pathname]);

    return (
        <PageWrapper>
            <div className="min-h-screen flex items-center justify-center bg-pairup-darkBlue">
                <div className="text-center max-w-md p-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-pairup-cream">
                        404
                    </h1>
                    <h2 className="text-2xl font-semibold mb-4 text-pairup-cream">
                        Page Not Found
                    </h2>
                    <p className="text-pairup-cream/80 mb-8 text-lg">
                        The page you're looking for doesn't exist or has been
                        moved.
                    </p>
                    <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-8 py-4 text-lg bg-pairup-cyan text-pairup-darkBlue hover:opacity-90 gap-2"
                        onClick={() => navigate("/")}
                        type="button"
                    >
                        <Home className="h-6 w-6" />
                        Return Home
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
};

export default NotFound;
