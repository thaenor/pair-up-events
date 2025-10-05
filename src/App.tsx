import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import * as Sentry from "@sentry/react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import TermsOfServicePage from "./pages/terms-of-service";
import PrivacyPolicyPage from "./pages/privacy-policy";
import { AuthProvider } from "./contexts/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import "./lib/sentry"; // Initialize Sentry

const App = () => {
  const appContent = (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster
            position="top-right"
            expand={true}
            richColors={true}
            closeButton={true}
          />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );

  // Only wrap with Sentry error boundary in production
  if (import.meta.env.MODE === 'production') {
    return (
      <Sentry.ErrorBoundary fallback={({ resetError }) => (
        <div className="min-h-screen flex items-center justify-center bg-pairup-darkBlue">
          <div className="text-center max-w-md p-4">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-pairup-cream mb-6">We're sorry, but something unexpected happened.</p>
            <button
              onClick={resetError}
              className="px-6 py-3 bg-pairup-cyan text-pairup-darkBlue font-medium rounded-lg hover:bg-pairup-cyan/90 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )}>
        {appContent}
      </Sentry.ErrorBoundary>
    );
  }

  return appContent;
};

export default App;
