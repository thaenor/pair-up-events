
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthPage from "@/components/auth/AuthPage";
import MainApp from "@/components/MainApp";
import ConfirmationPage from "@/components/confirmation/ConfirmationPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A2A33] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#F5E6C8] mb-4">
            <span className="text-[#27E9F3]">Pair</span>
            <span className="text-[#FECC08]">Up Events</span>
          </h1>
          <p className="text-[#F5E6C8]/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Confirmation pages (accessible without authentication) */}
      <Route path="/confirm/host-event" element={<ConfirmationPage type="host-event" />} />
      <Route path="/confirm/guest-request" element={<ConfirmationPage type="guest-request" />} />
      <Route path="/confirm/host-acceptance" element={<ConfirmationPage type="host-acceptance" />} />
      <Route path="/confirm/guest-final" element={<ConfirmationPage type="guest-final" />} />
      
      {/* Main app routes */}
      <Route path="/" element={user ? <MainApp /> : <AuthPage />} />
      <Route path="*" element={user ? <MainApp /> : <AuthPage />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
