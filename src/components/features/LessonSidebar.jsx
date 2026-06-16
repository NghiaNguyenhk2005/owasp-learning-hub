import { Link, useLocation } from 'react-router-dom'
import useAppStore from '@/store/useAppStore'
import { getSeverityStyles } from '@/utils/severity'
import { CheckCircle2 } from 'lucide-react'

export default function LessonSidebar({ lessons, currentId }) {
  const { progress } = useAppStore()

  return (
    <aside className="w-60 shrink-0 hidden xl:block">
      <div className="sticky top-20 space-y-1 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none pr-1">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-3">
          OWASP Top 10
        </p>
        {lessons.map((lesson) => {
          const done    = progress[lesson.id]?.completed ?? false
          const active  = lesson.id === currentId
          const styles  = getSeverityStyles(lesson.id)

          return (
            <Link
              key={lesson.id}
              to={`/lesson/${lesson.id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group
                ${active
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              {/* Severity dot */}
              <span className={`w-2 h-2 rounded-full shrink-0 ${styles.dot} ${done ? 'opacity-30' : ''}`} />

              {/* ID + name */}
              <span className="flex-1 min-w-0 truncate">
                <span className={`font-mono text-xs mr-1.5 ${active ? 'text-brand-500' : styles.text} opacity-80`}>
                  {lesson.id}
                </span>
                {lesson.name}
              </span>

              {/* Done checkmark */}
              {done && (
                <CheckCircle2 size={13} className="shrink-0 text-green-500 opacity-70" />
              )}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
