import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import { AuthProvider } from "./contexts/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => (
    <ErrorBoundary>
        <AuthProvider>
            <BrowserRouter future={{ v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/signup" element={<AuthPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />

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

export default App;
