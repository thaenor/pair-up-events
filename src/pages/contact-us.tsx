import React from 'react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'

// Social media icons as SVG components
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.011 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const MediumIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M13.54 12a6.8 6.8 0 01-1.5 4.29c-1.26 1.64-3.09 2.57-5.04 2.57-3.78 0-6.84-3.07-6.84-6.86S2.22 5.14 6 5.14c1.95 0 3.78.93 5.04 2.57a6.8 6.8 0 011.5 4.29zm5.5-1.07c0 3.64-2.92 6.59-6.52 6.59-3.6 0-6.52-2.95-6.52-6.59 0-3.64 2.92-6.59 6.52-6.59 3.6 0 6.52 2.95 6.52 6.59zm3.21-.39c0 3.25-1.32 5.89-2.95 5.89-1.63 0-2.95-2.64-2.95-5.89 0-3.25 1.32-5.89 2.95-5.89 1.63 0 2.95 2.64 2.95 5.89z" />
  </svg>
)

/**
 * Contact Us Page
 *
 * Displays social media channels and links for users to follow and support PairUp Events.
 * This page is accessible to both logged-in and logged-out users.
 *
 * @component
 * @example
 * ```tsx
 * <Route path="/contact-us" element={<ContactUsPage />} />
 * ```
 *
 * @features
 * - Public access (no authentication required)
 * - Social media links (Instagram, TikTok, Facebook, YouTube)
 * - Medium article link
 */
const ContactUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-32 pb-20 md:pb-8">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-6">Contact Us</h1>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-pairup-darkBlue">Follow and support our social channels.</h2>
            <p className="text-lg text-pairup-darkBlue/80 leading-relaxed">
              This platform lives from activity! Bring pairup events under the people. As more people know about it, as
              more likely will you find a duo that matches your vibe!
            </p>
          </section>

          <section className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="https://www.instagram.com/pairup_events?igsh=Y3I3dHF5Z3BpcWdr&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg text-white hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                aria-label="Visit our Instagram page"
              >
                <InstagramIcon className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">Instagram</span>
              </a>
              <a
                href="https://www.tiktok.com/@pairupevents?_r=1&_t=ZG-91F9Sj7k58y"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 bg-black rounded-lg text-white hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                aria-label="Visit our TikTok page"
              >
                <TikTokIcon className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">TikTok</span>
              </a>
              <a
                href="https://www.facebook.com/share/1A5bgW8tp6/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 bg-[#1877F2] rounded-lg text-white hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                aria-label="Visit our Facebook page"
              >
                <FacebookIcon className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">Facebook</span>
              </a>
              <a
                href="https://youtube.com/@pairup-events?si=9nfYn8GJb93AdUzp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 bg-[#FF0000] rounded-lg text-white hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                aria-label="Visit our YouTube channel"
              >
                <YouTubeIcon className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">YouTube</span>
              </a>
            </div>
          </section>

          <section className="pt-6">
            <p className="text-lg text-pairup-darkBlue/80 mb-4">Or read our journey in articles here:</p>
            <a
              href="https://ux-tara.medium.com/the-story-behind-the-idea-pairup-events-013e5c6bf75e"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 p-4 bg-black rounded-lg text-white hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
              aria-label="Read our journey on Medium"
            >
              <MediumIcon className="w-6 h-6" />
              <span className="font-semibold">Read on Medium</span>
            </a>
          </section>
        </div>
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default ContactUsPage
