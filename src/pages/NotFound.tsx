
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageWrapper } from "@/components";
import Button from "@/components/atoms/Button";
import { Home } from "lucide-react";
import { tokens } from "@/lib/tokens";

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
      <div className={`min-h-screen ${tokens.layout.flexCenter} ${tokens.bg.dark}`}>
        <div className={`text-center max-w-md ${tokens.spacing.sm}`}>
          <h1 className={`${tokens.text.hero} font-bold mb-4 ${tokens.colors.tertiary}`}>404</h1>
          <h2 className={`${tokens.text.xxl} font-semibold mb-4 ${tokens.colors.tertiary}`}>Page Not Found</h2>
          <p className={`text-pairup-cream/80 mb-8 ${tokens.text.lg}`}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.location.href = '/'}
            className={tokens.gap.sm}
          >
            <Home className={tokens.size.md} />
            Return Home
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
