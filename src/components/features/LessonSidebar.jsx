import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAppStore from '@/store/useAppStore'
import { getSeverityStyles } from '@/utils/severity'
import { CheckCircle2, X } from 'lucide-react'

/**
 * Desktop sidebar — sticky, always visible on xl+
 * Mobile drawer — slides in from left, controlled by isOpen/onClose
 */
export default function LessonSidebar({ lessons, currentId, isOpen, onClose }) {
  const { progress } = useAppStore()

  // Lock body scroll khi drawer mở
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const list = (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-3">
        OWASP Top 10
      </p>
      {lessons.map((lesson) => {
        const done   = progress[lesson.id]?.completed ?? false
        const active = lesson.id === currentId
        const styles = getSeverityStyles(lesson.id)

        return (
          <Link
            key={lesson.id}
            to={`/lesson/${lesson.id}`}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150
              ${active
                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${styles.dot} ${done ? 'opacity-30' : ''}`} />
            <span className="flex-1 min-w-0 truncate">
              <span className={`font-mono text-xs mr-1.5 ${active ? 'text-brand-500' : styles.text} opacity-80`}>
                {lesson.id}
              </span>
              {lesson.name}
            </span>
            {done && <CheckCircle2 size={13} className="shrink-0 text-green-500 opacity-70" />}
          </Link>
        )
      })}
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="w-60 shrink-0 hidden xl:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none pr-1">
          {list}
        </div>
      </aside>

      {/* ── Mobile drawer backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm xl:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <div className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800 shadow-2xl
        transform transition-transform duration-300 ease-in-out xl:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-800">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">Danh sách bài học</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-3.5rem)] p-3 scrollbar-none">
          {list}
        </div>
      </div>
    </>
  )
}
