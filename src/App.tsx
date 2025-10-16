import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Suspense, lazy, useEffect } from "react";

import { AuthProvider } from "./contexts/AuthProvider";
import { UserProfileProvider } from "./contexts/UserProfileProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { PWAInstallPrompt } from "./components/molecules/pwa-install-prompt";
import { initializeAnalytics } from "./lib/analytics";
import { PageTracker } from "./components/PageTracker";

const IndexPage = lazy(() => import("./pages/Index"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/auth"));
const LoginPage = lazy(() => import("./pages/login"));
const ProfilePage = lazy(() => import("./pages/profile"));
const TermsOfServicePage = lazy(() => import("./pages/terms-of-service"));
const PrivacyPolicyPage = lazy(() => import("./pages/privacy-policy"));


const App = () => {
  // Initialize analytics when the app loads
  useEffect(() => {
    initializeAnalytics();
  }, []);

  const appContent = (
    <AuthProvider>
      <UserProfileProvider>
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <PageTracker />
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
          <PWAInstallPrompt />
        </ErrorBoundary>
        </BrowserRouter>
      </UserProfileProvider>
    </AuthProvider>
  );

  return appContent;
};

export default App;
