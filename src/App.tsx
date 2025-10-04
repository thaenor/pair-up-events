import { BrowserRouter, Route, Routes } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth";
import { AuthProvider } from "./contexts/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => (
    <ErrorBoundary>
        <AuthProvider>
            <BrowserRouter future={{ v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/signup" element={<AuthPage />} />

                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </ErrorBoundary>
);

export default App;
