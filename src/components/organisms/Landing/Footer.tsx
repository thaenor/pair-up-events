import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../../atoms/Logo'

type FooterLink = {
  label: string
  targetId?: string
  href?: string
  ariaLabel: string
}

const footerLinkGroups: Array<{
  heading: string
  links: FooterLink[]
}> = [
  {
    heading: 'Platform',
    links: [
      {
        label: 'How it Works',
        targetId: 'how-it-works',
        ariaLabel: 'Navigate to the How it Works section',
      },
      {
        label: 'Create an Event',
        targetId: 'early-access',
        ariaLabel: 'Learn how to create an event in the Early Access section',
      },
      {
        label: 'Join an Event',
        targetId: 'early-access',
        ariaLabel: 'Join an event by signing up through the Early Access section',
      },
    ],
  },
  {
    heading: 'Company',
    links: [
      {
        label: 'About Us',
        targetId: 'benefits',
        ariaLabel: 'Discover more about Pair Up Events in the Benefits section',
      },
      {
        label: 'Contact',
        href: '/contact-us',
        ariaLabel: 'Navigate to the contact page',
      },
      {
        label: 'Careers',
        targetId: 'benefits',
        ariaLabel: "See why it's great to work with us in the Benefits section",
      },
    ],
  },
  {
    heading: 'Legal',
    links: [
      {
        label: 'Privacy Policy',
        href: '/privacy-policy',
        ariaLabel: 'Review our privacy policy and data handling practices',
      },
      {
        label: 'Terms of Service',
        href: '/terms-of-service',
        ariaLabel: 'Read our terms of service and user agreement',
      },
      {
        label: 'Cookie Policy',
        targetId: 'benefits',
        ariaLabel: 'Learn more about our approach in the Benefits section',
      },
    ],
  },
]

const Footer = () => {
  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault()
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <footer className="py-12 bg-pairup-darkBlue" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo size="md" />
            <p className="text-sm text-pairup-cream/70 mt-2">
              You and your friend meet another pair for a shared activity
            </p>
          </div>

          <nav className="grid md:grid-cols-3 gap-8 text-center md:text-left" aria-label="Footer navigation">
            {footerLinkGroups.map(group => (
              <div key={group.heading}>
                <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">{group.heading}</h3>
                <ul className="space-y-2 text-sm">
                  {group.links.map(link => (
                    <li key={`${group.heading}-${link.label}`}>
                      {link.href ? (
                        <Link
                          to={link.href}
                          aria-label={link.ariaLabel}
                          className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={`#${link.targetId}`}
                          onClick={event => handleLinkClick(event, link.targetId!)}
                          aria-label={link.ariaLabel}
                          className="text-pairup-cream/70 hover:text-pairup-cream duration-300"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-pairup-darkBlueAlt/30 mt-12 pt-8 text-center text-sm text-pairup-cream/50">
          &copy; 2025 Pair Up Events. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
