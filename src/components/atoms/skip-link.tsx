import React from 'react'

/**
 * Props for the SkipLink component
 *
 * @typedef {Object} SkipLinkProps
 * @property {string} targetId - ID of the target element to skip to
 * @property {string} [label='Skip to main content'] - Link text label
 * @property {string} [className=''] - Additional CSS classes
 */
export type SkipLinkProps = {
  targetId: string
  label?: string
  className?: string
}

/**
 * Skip link component for keyboard navigation accessibility
 *
 * Provides a keyboard-accessible link that allows users to skip to main content
 * without having to tab through navigation elements. Hidden by default, appears
 * on focus for keyboard users.
 *
 * @component
 * @param {SkipLinkProps} props - Component props
 *
 * @example
 * ```tsx
 * <SkipLink targetId="main-content" />
 * ```
 */
const SkipLink: React.FC<SkipLinkProps> = ({ targetId, label = 'Skip to main content', className = '' }) => {
  return (
    <a
      href={`#${targetId}`}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-pairup-cyan text-pairup-darkBlue px-4 py-2 rounded-md font-medium z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan transition-all ${className}`}
      tabIndex={1}
      aria-label={label}
    >
      {label}
    </a>
  )
}

export default SkipLink
