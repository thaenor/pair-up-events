import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Suspense, lazy, useEffect } from "react";

import { AuthProvider } from "./contexts/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import SentryBoundary from "./components/SentryBoundary";
import { initializeSentry } from "./lib/sentry";

const IndexPage = lazy(() => import("./pages/Index"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/auth"));
const LoginPage = lazy(() => import("./pages/login"));
const ProfilePage = lazy(() => import("./pages/profile"));
const TermsOfServicePage = lazy(() => import("./pages/terms-of-service"));
const PrivacyPolicyPage = lazy(() => import("./pages/privacy-policy"));

// Component to handle GitHub Pages 404 redirects
const GitHubPagesRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we're on a GitHub Pages redirect URL (/?/path)
    if (location.pathname === '/' && location.search.startsWith('/?/')) {
      const path = location.search.slice(3).replace(/~and~/g, '&');
      const newPath = path.split('&')[0]; // Remove query params for now

      // Replace the current URL with the correct path
      window.history.replaceState(null, '', newPath);
    }
  }, [location]);

  return null;
};

const App = () => {
  useEffect(() => {
    if (!import.meta.env.PROD || typeof window === 'undefined') {
      return;
    }

    const supportsIdle = typeof window.requestIdleCallback === 'function';

    if (supportsIdle) {
      const idleId = window.requestIdleCallback(() => {
        initializeSentry();
      });

      return () => {
        window.cancelIdleCallback?.(idleId);
      };
    }

    const timeout = window.setTimeout(() => {
      initializeSentry();
    }, 2000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  const appContent = (
    <AuthProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <GitHubPagesRedirect />
        <ErrorBoundary>
          <Suspense
            fallback={(
              <div className="min-h-screen flex items-center justify-center bg-pairup-darkBlue text-pairup-cream">
                Loading...
              </div>
            )}
          >
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/404" element={<NotFoundPage />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster
            position="top-right"
            expand={true}
            richColors={true}
            closeButton={true}
          />
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );

  return <SentryBoundary>{appContent}</SentryBoundary>;
};

export default App;
