import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Suspense, lazy, useMemo } from 'react'

import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/atoms/LoadingSpinner'

const IndexPage = lazy(() => import('./pages/Index'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))
const AuthPage = lazy(() => import('./pages/auth'))
const LoginPage = lazy(() => import('./pages/login'))
const ProfilePage = lazy(() => import('./pages/profile'))
const EventsPage = lazy(() => import('./pages/events'))
const EventsCreatePage = lazy(() => import('./pages/events-create'))
const MessengerPage = lazy(() => import('./pages/messenger'))
const TermsOfServicePage = lazy(() => import('./pages/terms-of-service'))
const PrivacyPolicyPage = lazy(() => import('./pages/privacy-policy'))
const SettingsPage = lazy(() => import('./pages/settings'))
const InvitePage = lazy(() => import('./pages/invite'))
const ContactUsPage = lazy(() => import('./pages/contact-us'))
const AboutPage = lazy(() => import('./pages/about'))

const App = () => {
  const loadingFallback = useMemo(
    () => (
      <div
        className="min-h-screen flex items-center justify-center bg-pairup-darkBlue text-pairup-cream"
        role="alert"
        aria-busy="true"
      >
        <LoadingSpinner size="lg" aria-label="Loading page content" />
      </div>
    ),
    []
  )

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <Suspense fallback={loadingFallback}>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/create" element={<EventsCreatePage />} />
            <Route path="/messenger" element={<MessengerPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" expand={true} richColors={true} closeButton={true} />
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
