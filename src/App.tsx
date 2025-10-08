import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Suspense, lazy } from "react";

import { AuthProvider } from "./contexts/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";

const IndexPage = lazy(() => import("./pages/Index"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/auth"));
const LoginPage = lazy(() => import("./pages/login"));
const ProfilePage = lazy(() => import("./pages/profile"));
const TermsOfServicePage = lazy(() => import("./pages/terms-of-service"));
const PrivacyPolicyPage = lazy(() => import("./pages/privacy-policy"));


const App = () => {

  const appContent = (
    <AuthProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
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

  return appContent;
};

export default App;
