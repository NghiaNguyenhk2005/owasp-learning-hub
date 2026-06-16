/**
 * Toast notification đơn giản
 * Props: message, type ('success' | 'error' | 'info'), onClose
 */
export default function Toast({ message, type = 'info', onClose }) {
  const colors = {
    success: 'bg-green-50 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300',
    error:   'bg-red-50 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300',
    info:    'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
  }

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${colors[type]}`}>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">✕</button>
      )}
    </div>
  )
}
