import { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

/**
 * Search bar cho HomePage
 * Props: value, onChange, onClear, placeholder
 */
export default function SearchBar({ value, onChange, onClear, placeholder = 'Tìm kiếm bài học...' }) {
  const inputRef = useRef(null)

  // Ctrl+K / Cmd+K focus
  useEffect(() => {
    function handler(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
        onClear?.()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClear])

  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-16 py-2 rounded-xl border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
          transition-colors"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value ? (
          <button
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-xs
            border border-gray-200 dark:border-gray-700 text-gray-400 font-mono leading-none">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  )
}
