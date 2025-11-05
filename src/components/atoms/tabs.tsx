import React, { forwardRef, ButtonHTMLAttributes, useCallback } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Props for individual tab buttons
 *
 * @typedef {Object} TabButtonProps
 * @property {boolean} [selected=false] - Whether this tab is currently selected
 * @property {React.ReactNode} [icon] - Optional icon to display
 * @property {string} [className] - Additional CSS classes
 */
export type TabButtonProps = {
  selected?: boolean
  icon?: React.ReactNode
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(function TabButton(
  { selected = false, icon, className, type = 'button', disabled, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      role="tab"
      aria-selected={selected}
      className={twMerge(
        clsx(
          'flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60',
          selected
            ? 'border-pairup-cyan text-pairup-cyan'
            : 'border-transparent text-pairup-darkBlue/60 hover:text-pairup-darkBlue hover:border-gray-300',
          className
        )
      )}
      {...rest}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
})

/**
 * Definition structure for individual tabs in the tabs array
 *
 * @typedef {Object} TabDefinition
 * @property {string} id - Unique identifier for the tab
 * @property {string} label - Display label for the tab
 * @property {React.ReactNode} [icon] - Optional icon to display
 * @property {boolean} [disabled=false] - Whether the tab is disabled
 * @property {Function} [render] - Function that returns the tab content
 * @property {React.ReactNode} [content] - Static content for the tab
 * @property {string} [className] - Additional CSS classes
 */
export interface TabDefinition {
  id: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  render?: () => React.ReactNode
  content?: React.ReactNode
  className?: string
}

/**
 * Props for the Tabs component
 *
 * @typedef {Object} TabsProps
 * @property {TabDefinition[]} tabs - Array of tab definitions
 * @property {string} selectedId - ID of the currently selected tab
 * @property {Function} onChange - Callback when tab selection changes
 * @property {('horizontal' | 'vertical')} [orientation='horizontal'] - Tab layout direction
 * @property {boolean} [distributeEvenly=true] - Whether to distribute tabs evenly
 * @property {string} [className] - Additional CSS classes for container
 * @property {string} [tabListClassName] - Additional CSS classes for tab list
 * @property {string} [panelClassName] - Additional CSS classes for content panel
 * @property {Function} [getNextId] - Custom function to determine next/previous tab
 * @property {string} [aria-label] - Accessibility label for tab list
 * @property {('off' | 'polite' | 'assertive')} [aria-live='off'] - ARIA live region setting
 */
export interface TabsProps {
  tabs: TabDefinition[]
  selectedId: string
  onChange: (id: string) => void
  orientation?: 'horizontal' | 'vertical'
  distributeEvenly?: boolean
  className?: string
  tabListClassName?: string
  panelClassName?: string
  getNextId?: (currentId: string, direction: 'next' | 'prev', tabs: TabDefinition[]) => string
  'aria-label'?: string
  'aria-live'?: 'off' | 'polite' | 'assertive'
}

/**
 * Tabs component with keyboard navigation support
 *
 * Provides an accessible, fully-featured tab interface with keyboard navigation
 * (Arrow keys, Home, End). Supports both horizontal and vertical orientations.
 *
 * @component
 * @param {TabsProps} props - Component props
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { id: 'tab1', label: 'Tab 1', content: <Content1 /> },
 *   { id: 'tab2', label: 'Tab 2', content: <Content2 /> }
 * ];
 *
 * <Tabs tabs={tabs} selectedId={selectedId} onChange={setSelectedId} />
 * ```
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  selectedId,
  onChange,
  orientation = 'horizontal',
  distributeEvenly = true,
  className,
  tabListClassName,
  panelClassName,
  getNextId,
  'aria-label': ariaLabel,
  'aria-live': ariaLive,
}) => {
  /**
   * Tabs component with keyboard navigation support
   *
   * Provides an accessible, fully-featured tab interface with keyboard navigation
   * (Arrow keys, Home, End). Supports both horizontal and vertical orientations.
   *
   * @component
   * @param {TabsProps} props - Component props
   *
   * @example
   * ```tsx
   * const tabs = [
   *   { id: 'tab1', label: 'Tab 1', content: <Content1 /> },
   *   { id: 'tab2', label: 'Tab 2', content: <Content2 /> }
   * ];
   *
   * <Tabs tabs={tabs} selectedId={selectedId} onChange={setSelectedId} />
   * ```
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const key = e.key
      const horizontal = orientation === 'horizontal'
      const isPrev = (horizontal && key === 'ArrowLeft') || (!horizontal && key === 'ArrowUp')
      const isNext = (horizontal && key === 'ArrowRight') || (!horizontal && key === 'ArrowDown')
      const ids = tabs.map(t => t.id).filter(id => !tabs.find(t => t.id === id)?.disabled)
      const currentIndex = ids.indexOf(selectedId)
      let targetId: string | null = null

      if (key === 'Home') targetId = ids[0]
      else if (key === 'End') targetId = ids[ids.length - 1]
      else if (isPrev) targetId = ids[Math.max(0, currentIndex - 1)]
      else if (isNext) targetId = ids[Math.min(ids.length - 1, currentIndex + 1)]

      if (targetId && getNextId) {
        targetId = getNextId(selectedId, isPrev ? 'prev' : 'next', tabs)
      }

      if (targetId && targetId !== selectedId) {
        e.preventDefault()
        onChange(targetId)
      }
    },
    [orientation, tabs, selectedId, onChange, getNextId]
  )

  const selected = tabs.find(t => t.id === selectedId)

  return (
    <div className={clsx(className)}>
      <div
        role="tablist"
        aria-orientation={orientation}
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={twMerge(clsx('flex', orientation === 'vertical' && 'flex-col', tabListClassName))}
      >
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            id={`tab-${tab.id}`}
            aria-controls={`tabpanel-${tab.id}`}
            selected={tab.id === selectedId}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            icon={tab.icon}
            className={twMerge(clsx(distributeEvenly && 'flex-1', tab.className))}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
      <div
        id={`tabpanel-${selected?.id ?? 'none'}`}
        role="tabpanel"
        aria-labelledby={selected ? `tab-${selected.id}` : undefined}
        aria-live={ariaLive}
        className={clsx(panelClassName)}
      >
        {selected && (selected.render ? selected.render() : selected.content)}
      </div>
    </div>
  )
}

export default Tabs
