import React from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Props for the LoadingSpinner component
 *
 * @typedef {Object} LoadingSpinnerProps
 * @property {('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'hero')} [size='md'] - Spinner size
 * @property {string} [className] - Additional CSS classes
 * @property {string} [aria-label='Loading'] - Accessibility label
 */
interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'hero'
  className?: string
  'aria-label'?: string
}

/**
 * Animated loading spinner component
 *
 * Displays a spinning loader icon with configurable sizes. Used to indicate
 * that content is loading or an operation is in progress.
 *
 * @component
 * @param {LoadingSpinnerProps} props - Component props
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="lg" aria-label="Loading content" />
 * ```
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  'aria-label': ariaLabel = 'Loading',
}) => {
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

  return (
    <Loader2
      className={twMerge(clsx('animate-spin text-pairup-cyan', getSizeClasses(), className))}
      role="status"
      aria-label={ariaLabel}
    />
  )
}

export default LoadingSpinner
