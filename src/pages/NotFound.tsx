
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageWrapper } from "@/components";
import Button from "@/components/atoms/Button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log 404 errors for monitoring (in production, send to error reporting service)
    if (process.env.NODE_ENV === 'development') {
      console.warn(`404 Error: Route not found - ${location.pathname}`);
    }
  }, [location.pathname]);

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-pairup-darkBlue">
        <div className="text-center max-w-md p-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-pairup-cream">404</h1>
          <h2 className="text-2xl font-semibold mb-4 text-pairup-cream">Page Not Found</h2>
          <p className="text-pairup-cream/80 mb-8 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.location.href = '/'}
            className="gap-2"
          >
            <Home className="h-6 w-6" />
            Return Home
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
