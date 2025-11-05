import React from 'react'
import clsx from 'clsx'

/**
 * Common props shared across all form field components
 *
 * @typedef {Object} CommonProps
 * @property {string} label - Label text for the field
 * @property {string} name - Name attribute for the input element
 * @property {boolean} [required=false] - Whether the field is required
 * @property {string} [error] - Error message to display
 * @property {React.ReactNode} [children] - Additional content
 * @property {string} [description] - Helper text description
 */
type CommonProps = {
  label: string
  name: string
  required?: boolean
  error?: string
  children?: React.ReactNode
  description?: string
}

const labelBase = 'text-sm font-medium text-pairup-darkBlue/80'
const errorText = 'text-sm text-red-600'
const inputBase =
  'w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60'
const normalBorder = 'border-gray-200 focus-visible:border-pairup-cyan focus-visible:ring-pairup-cyan'
const errorBorder = 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500'

/**
 * Labeled input field component
 *
 * Displays an input field with a label, optional error message, and helper text.
 * Automatically handles error state styling and accessibility attributes.
 *
 * @component
 * @param {CommonProps & React.InputHTMLAttributes<HTMLInputElement>} props - Component props
 *
 * @example
 * ```tsx
 * <LabeledInput
 *   label="Email"
 *   name="email"
 *   required
 *   error={errors.email}
 * />
 * ```
 */
export const LabeledInput: React.FC<CommonProps & React.InputHTMLAttributes<HTMLInputElement>> = ({
  label,
  name,
  required,
  error,
  description,
  ...rest
}) => {
  const id = name
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelBase}>
        {label}
        {required && ' *'}
      </label>
      <input
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={clsx(inputBase, error ? errorBorder : normalBorder)}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className={errorText}>
          {error}
        </p>
      )}
      {description && <p className="text-xs text-pairup-darkBlue/60">{description}</p>}
    </div>
  )
}

/**
 * Labeled textarea field component
 *
 * Displays a textarea with a label, optional error message, and helper text.
 * Supports multi-line text input with automatic error state styling.
 *
 * @component
 * @param {CommonProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>} props - Component props
 *
 * @example
 * ```tsx
 * <LabeledTextarea
 *   label="Description"
 *   name="description"
 *   rows={4}
 *   error={errors.description}
 * />
 * ```
 */
export const LabeledTextarea: React.FC<CommonProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  label,
  name,
  required,
  error,
  description,
  ...rest
}) => {
  const id = name
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelBase}>
        {label}
        {required && ' *'}
      </label>
      <textarea
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={clsx(inputBase, error ? errorBorder : normalBorder)}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className={errorText}>
          {error}
        </p>
      )}
      {description && <p className="text-xs text-pairup-darkBlue/60">{description}</p>}
    </div>
  )
}

/**
 * Select dropdown option structure
 *
 * @typedef {Object} SelectOption
 * @property {string} value - Option value
 * @property {string} label - Display label
 */
export interface SelectOption {
  value: string
  label: string
}

/**
 * Labeled select dropdown component
 *
 * Displays a select dropdown with a label, optional error message, and helper text.
 * Supports custom option lists and automatic error state styling.
 *
 * @component
 * @param {CommonProps & { options: SelectOption[] } & React.SelectHTMLAttributes<HTMLSelectElement>} props - Component props
 * @param {SelectOption[]} props.options - Array of select options
 *
 * @example
 * ```tsx
 * <LabeledSelect
 *   label="Country"
 *   name="country"
 *   options={[{value: 'us', label: 'USA'}, {value: 'uk', label: 'UK'}]}
 *   required
 * />
 * ```
 */
export const LabeledSelect: React.FC<
  CommonProps & { options: SelectOption[] } & React.SelectHTMLAttributes<HTMLSelectElement>
> = ({ label, name, required, error, options, description, ...rest }) => {
  const id = name
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelBase}>
        {label}
        {required && ' *'}
      </label>
      <select id={id} aria-invalid={!!error} className={clsx(inputBase, error ? errorBorder : normalBorder)} {...rest}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className={errorText}>{error}</p>}
      {description && <p className="text-xs text-pairup-darkBlue/60">{description}</p>}
    </div>
  )
}
