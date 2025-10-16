import React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/**
 * Props for Modal component
 *
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Whether the modal is open
 * @property {() => void} onClose - Callback when modal should close
 * @property {string} title - Modal title
 * @property {React.ReactNode} children - Modal content
 * @property {React.ReactNode} [icon] - Optional icon to display next to title
 * @property {React.ReactNode} [actions] - Action buttons (Cancel, Confirm, etc.)
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Modal size variant
 * @property {boolean} [closeOnOverlayClick=true] - Whether clicking overlay closes modal
 * @property {string} [className] - Additional CSS classes for modal content
 */
export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
  actions?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeOnOverlayClick?: boolean
  className?: string
}

/**
 * Modal component for displaying overlays
 *
 * Displays content in a centered modal overlay with backdrop blur.
 * Supports different sizes and custom actions. Uses portals to render
 * outside the normal DOM hierarchy.
 *
 * @component
 * @param {ModalProps} props - Component props
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   icon={<AlertTriangle />}
 *   actions={
 *     <>
 *       <button onClick={onClose}>Cancel</button>
 *       <button onClick={handleConfirm}>Confirm</button>
 *     </>
 *   }
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  icon,
  actions,
  size = 'md',
  closeOnOverlayClick = true,
  className = '',
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`bg-white rounded-lg p-6 w-full ${sizeClasses[size]} ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <h3 id="modal-title" className="text-lg font-semibold text-pairup-darkBlue flex-1">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-pairup-darkBlue/80 mb-6">{children}</div>

        {/* Actions */}
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </div>,
    document.body
  )
}

Modal.displayName = 'Modal'

export default Modal
