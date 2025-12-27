import React from 'react'
import { AlertTriangle } from 'lucide-react'

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger' or 'warning'
}) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              type === 'danger' 
                ? 'bg-status-danger-bg text-status-danger-text' 
                : 'bg-status-progress-bg text-status-progress-text'
            }`}>
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-lg font-semibold text-text-main">{title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-text-sub">{message}</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded bg-surface text-text-main hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded text-white transition-colors shadow-sm ${
              type === 'danger'
                ? 'bg-status-danger-text hover:bg-red-700'
                : 'bg-primary hover:bg-primary-hover'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
