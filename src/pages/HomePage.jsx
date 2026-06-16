import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAppStore from '@/store/useAppStore'
import Navbar from '@/components/ui/Navbar'
import ProgressBar from '@/components/ui/ProgressBar'
import LessonCard from '@/components/features/LessonCard'
import { exportProgress, resetProgress } from '@/services/progressService'

export default function HomePage() {
  const { lessons, progress, completionPercent, isLoading, error, loadLessons, resetAllProgress, initDarkMode } =
    useAppStore()

  const [filter, setFilter] = useState('all') // 'all' | 'done' | 'todo'
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    initDarkMode()
    loadLessons()
  }, [])

  // Filter lessons
  const filtered = lessons.filter((l) => {
    if (filter === 'done') return progress[l.id]?.completed
    if (filter === 'todo') return !progress[l.id]?.completed
    return true
  })

  function handleExport() {
    const json = exportProgress()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'owasp-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    resetAllProgress()
    setConfirmReset(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Đang tải...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Lỗi: {error}
      </div>
    )
  }

  const doneLessons = lessons.filter((l) => progress[l.id]?.completed).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Học OWASP Top 10
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Hiểu và thực hành 10 lỗ hổng bảo mật web hàng đầu — qua lý thuyết, quiz và sandbox thực chiến.
          </p>

          {/* Progress tổng quan */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tiến độ tổng quan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {doneLessons}
                  <span className="text-base font-normal text-gray-400"> / {lessons.length} bài</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                >
                  Xuất JSON
                </button>
                <button
                  onClick={handleReset}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    confirmReset
                      ? 'border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {confirmReset ? 'Xác nhận reset?' : 'Reset tiến độ'}
                </button>
              </div>
            </div>
            <ProgressBar percent={completionPercent} />
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: `Tất cả (${lessons.length})` },
            { key: 'todo', label: `Chưa học (${lessons.length - doneLessons})` },
            { key: 'done', label: `Hoàn thành (${doneLessons})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                filter === tab.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-brand-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lesson grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Không có bài học nào trong mục này.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={progress[lesson.id] ?? null}
              />
            ))}
          </div>
        )}

        {/* CTA luyện tập */}
        {doneLessons > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
            >
              🎯 Luyện tập tổng hợp
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
