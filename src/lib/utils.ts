import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge and deduplicate Tailwind CSS classes
 *
 * Combines clsx for conditional class names with tailwind-merge to intelligently
 * resolve Tailwind class conflicts (e.g., 'p-2 p-4' becomes 'p-4').
 *
 * @param {...ClassValue[]} inputs - Array of class values to merge
 * @returns {string} Merged and deduplicated class string
 *
 * @example
 * ```tsx
 * cn('p-4', 'bg-white') // "p-4 bg-white"
 * cn('p-2', 'p-4') // "p-4" (deduplicates)
 * cn({ 'bg-blue-500': isActive }) // conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
