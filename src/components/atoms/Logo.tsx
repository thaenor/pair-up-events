import React from 'react'

/**
 * Props for the Logo component
 *
 * @typedef {Object} LogoProps
 * @property {('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'hero')} [size='md'] - Logo size
 * @property {boolean} [showText=true] - Display "PairUp Events" text alongside logo
 */
interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'hero'
  showText?: boolean
}

/**
 * PairUp Events logo component
 *
 * Displays the PairUp Events logo (icon + optional text) with configurable
 * sizes and the ability to show/hide the text portion.
 *
 * @component
 * @param {LogoProps} props - Component props
 *
 * @example
 * ```tsx
 * <Logo size="lg" showText={true} />
 * <Logo size="sm" showText={false} />
 * ```
 */
const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'h-3 w-3'
      case 'sm':
        return 'h-4 w-4'
      case 'md':
        return 'h-6 w-6'
      case 'lg':
        return 'h-8 w-8'
      case 'xl':
        return 'h-12 w-12'
      case 'xxl':
        return 'h-16 w-16'
      case 'xxxl':
        return 'h-24 w-24'
      case 'hero':
        return 'h-64 w-64 md:h-80 md:w-80'
      default:
        return 'h-6 w-6'
    }
  }

  const getTextClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-xs'
      case 'sm':
        return 'text-sm'
      case 'md':
        return 'text-base'
      case 'lg':
        return 'text-lg'
      case 'xl':
        return 'text-xl'
      case 'xxl':
        return 'text-2xl'
      case 'xxxl':
        return 'text-3xl'
      case 'hero':
        return 'text-4xl md:text-5xl lg:text-6xl'
      default:
        return 'text-base'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <img src="/PUE_logo_transparent.png" alt="Pair Up Events logo" className={`${getSizeClasses()} object-contain`} />
      {showText && (
        <span className={`${getTextClasses()} font-bold`}>
          <span className="text-pairup-cyan">Pair</span>
          <span className="text-pairup-yellow">Up Events</span>
        </span>
      )}
    </div>
  )
}

export default Logo
