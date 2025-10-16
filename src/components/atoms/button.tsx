import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import LoadingSpinner from './LoadingSpinner'

/**
 * Visual style variants for the Button component
 *
 * @typedef {('primary' | 'secondary' | 'outline' | 'ghost' | 'danger')} ButtonVariant
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

/**
 * Size options for the Button component
 *
 * @typedef {('xs' | 'sm' | 'md' | 'lg' | 'xl')} ButtonSize
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Props for the Button component
 *
 * @typedef {Object} ButtonProps
 * @property {ButtonVariant} [variant='primary'] - Visual style variant
 * @property {ButtonSize} [size='md'] - Button size
 * @property {boolean} [loading=false] - Show loading spinner and disable button
 * @property {boolean} [fullWidth=false] - Expand button to full width of container
 * @property {React.ReactNode} [icon] - Icon to display on the left side
 * @property {React.ReactNode} [iconRight] - Icon to display on the right side
 * @property {string} [className] - Additional CSS classes
 */
export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode // left icon
  iconRight?: React.ReactNode // right icon
  children?: React.ReactNode
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

/**
 * Maps button variants to their corresponding Tailwind CSS classes
 *
 * @type {Object.<ButtonVariant, string>}
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-pairup-cyan text-pairup-darkBlue hover:bg-pairup-cyan/90 focus:ring-pairup-cyan',
  secondary: 'bg-pairup-yellow text-pairup-darkBlue hover:bg-pairup-yellow/90 focus:ring-pairup-yellow',
  outline: 'border border-pairup-cyan text-pairup-cyan hover:bg-pairup-cyan/10 focus:ring-pairup-cyan',
  ghost: 'text-pairup-cyan hover:bg-pairup-cyan/10 focus:ring-pairup-cyan',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
}

/**
 * Maps button sizes to their corresponding Tailwind CSS classes
 *
 * @type {Object.<ButtonSize, string>}
 */
const sizeClasses: Record<ButtonSize, string> = {
  xs: 'text-xs px-2 py-1 h-7',
  sm: 'text-sm px-3 py-1.5 h-8',
  md: 'text-sm px-4 py-2 h-10',
  lg: 'text-base px-5 py-2.5 h-12',
  xl: 'text-lg px-6 py-3 h-14',
}

// Order: layout/spacing -> typography -> color/border -> state classes
/**
 * Base CSS classes for all button variants
 *
 * @type {string}
 */
const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2'

/**
 * Primary button component with multiple variants and sizes
 *
 * Supports loading states, icons, and full-width layout. Automatically
 * handles disabled states during loading and provides accessibility attributes.
 *
 * @component
 * @param {ButtonProps} props - Component props
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" loading={isSubmitting}>
 *   Submit Form
 * </Button>
 *
 * <Button variant="outline" icon={<Icon />} iconRight={<Arrow />}>
 *   Action
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    iconRight,
    children,
    className,
    type = 'button',
    disabled,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading || undefined}
      className={twMerge(
        clsx(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          loading && 'relative',
          className
        )
      )}
      {...rest}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center" data-testid="button-loading">
          <LoadingSpinner size={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'md'} aria-label="Loading" />
        </span>
      )}
      <span className={clsx('flex items-center gap-2', loading && 'opacity-0')} data-testid="button-content">
        {icon && (
          <span className="flex items-center" data-testid="button-icon-left">
            {icon}
          </span>
        )}
        {children}
        {iconRight && (
          <span className="flex items-center" data-testid="button-icon-right">
            {iconRight}
          </span>
        )}
      </span>
    </button>
  )
})

export default Button
