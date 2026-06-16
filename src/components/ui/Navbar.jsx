import useAppStore from '@/store/useAppStore'
import { Sun, Moon, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useAppStore()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-brand-600 dark:text-brand-500">
          <Shield size={22} />
          OWASP Learning Hub
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/practice" className="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Luyện tập
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
