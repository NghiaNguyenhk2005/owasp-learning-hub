import { Link } from 'react-router-dom'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressBar from '@/components/ui/ProgressBar'

/**
 * Card hiển thị một bài học OWASP trên trang chủ
 */
export default function LessonCard({ lesson, progress }) {
  const completed = progress?.completed ?? false
  const quizScore = progress?.quizScore ?? null

  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
            {lesson.id}
          </span>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mt-0.5">
            {lesson.name}
          </h3>
        </div>
        <StatusBadge completed={completed} />
      </div>

      {/* Short description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
        {lesson.shortDesc}
      </p>

      {/* Quiz score nếu đã làm */}
      {quizScore !== null && (
        <div className="mb-3">
          <ProgressBar percent={quizScore} label="Quiz" />
        </div>
      )}

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {lesson.quiz && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            Quiz
          </span>
        )}
        {lesson.tryAndCode && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            Try & Code
          </span>
        )}
      </div>
    </Link>
  )
}
