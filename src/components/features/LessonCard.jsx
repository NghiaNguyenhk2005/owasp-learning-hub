import { Link } from 'react-router-dom'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressBar from '@/components/ui/ProgressBar'
import { getSeverity, getSeverityStyles } from '@/utils/severity'
import { estimateReadingTime } from '@/utils/readingTime'
import { Clock } from 'lucide-react'

export default function LessonCard({ lesson, progress }) {
  const completed   = progress?.completed ?? false
  const quizScore   = progress?.quizScore ?? null
  const severity    = getSeverity(lesson.id)
  const styles      = getSeverityStyles(lesson.id)
  const readingMins = estimateReadingTime(lesson)

  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className={`group relative block rounded-2xl border bg-white dark:bg-gray-900 p-5
        overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5
        ${completed
          ? 'border-green-200 dark:border-green-900/50'
          : `border-gray-200 dark:border-gray-800 ${styles.glow}`
        }`}
    >
      {/* Severity accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${styles.accent} ${completed ? 'opacity-30' : 'opacity-80'}`} />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3 mt-1">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${styles.badge}`}>
            {lesson.id}
          </span>
          <span className={`text-xs font-medium ${styles.text} opacity-75`}>
            {severity.label}
          </span>
        </div>
        <StatusBadge completed={completed} />
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2 leading-snug">
        {lesson.name}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
        {lesson.shortDesc}
      </p>

      {/* Quiz score */}
      {quizScore !== null && (
        <div className="mb-3">
          <ProgressBar percent={quizScore} label="Quiz" />
        </div>
      )}

      {/* Footer: tags + reading time */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          {lesson.quiz && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              Quiz
            </span>
          )}
          {lesson.tryAndCode && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              Hack It
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 shrink-0">
          <Clock size={11} />
          ~{readingMins} phút
        </span>
      </div>
    </Link>
  )
}
