import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useAppStore from '@/store/useAppStore'
import Navbar from '@/components/ui/Navbar'
import ProgressBar from '@/components/ui/ProgressBar'
import LessonCard from '@/components/features/LessonCard'
import SearchBar from '@/components/ui/SearchBar'
import { LessonCardSkeleton } from '@/components/ui/Skeleton'
import { exportProgress } from '@/services/progressService'
import PlanningPanel from '@/components/features/PlanningPanel'

export default function HomePage() {
  const { lessons, progress, completionPercent, isLoading, error, loadLessons, resetAllProgress, initDarkMode } =
    useAppStore()

  const [filter, setFilter]           = useState('all')
  const [search, setSearch]           = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    initDarkMode()
    loadLessons()
  }, [])

  const doneLessons = lessons.filter((l) => progress[l.id]?.completed).length

  // Filter + search
  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      const matchFilter =
        filter === 'done' ? progress[l.id]?.completed :
        filter === 'todo' ? !progress[l.id]?.completed :
        true
      const q = search.toLowerCase().trim()
      const matchSearch = !q || [l.id, l.name, l.shortDesc].some((s) =>
        s?.toLowerCase().includes(q)
      )
      return matchFilter && matchSearch
    })
  }, [lessons, progress, filter, search])

  function handleExport() {
    const json = exportProgress()
    const blob = new Blob([json], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = 'owasp-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return }
    resetAllProgress()
    setConfirmReset(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse mb-2" />
          <div className="h-4 w-96 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <LessonCardSkeleton key={i} />)}
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-red-500 font-medium mb-2">Không thể tải dữ liệu</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 page-enter">

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Học OWASP Top 10
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Hiểu và thực hành 10 lỗ hổng bảo mật web hàng đầu — qua lý thuyết, quiz và sandbox thực chiến.
          </p>

          {/* Progress card */}
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

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            {[
              { key: 'all',  label: `Tất cả (${lessons.length})`           },
              { key: 'todo', label: `Chưa học (${lessons.length - doneLessons})` },
              { key: 'done', label: `Xong (${doneLessons})`                },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`text-sm px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                  filter === tab.key
                    ? 'bg-brand-600 text-white'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-brand-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Planning panel */}
        <div className="mb-8">
          <PlanningPanel />
        </div>

        {/* Lesson grid / Empty states */}
        {filtered.length === 0 ? (
          <EmptyState filter={filter} search={search} onClear={() => { setSearch(''); setFilter('all') }} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} progress={progress[lesson.id] ?? null} />
            ))}
          </div>
        )}

        {/* CTA luyện tập */}
        {doneLessons > 0 && !search && (
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

// ── Empty State component ─────────────────────────────────────────────────

function EmptyState({ filter, search, onClear }) {
  if (search) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-4xl">🔎</p>
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Không tìm thấy kết quả cho <span className="text-brand-600">"{search}"</span>
        </p>
        <p className="text-sm text-gray-400">Thử tìm theo tên lỗ hổng, mã (A01...) hoặc mô tả.</p>
        <button
          onClick={onClear}
          className="mt-2 text-sm text-brand-600 dark:text-brand-400 hover:underline"
        >
          Xóa tìm kiếm
        </button>
      </div>
    )
  }

  if (filter === 'done') {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-4xl">📚</p>
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Bạn chưa hoàn thành bài nào
        </p>
        <p className="text-sm text-gray-400">Bắt đầu với A01 — chỉ mất ~5 phút cho bài đầu tiên.</p>
        <button
          onClick={onClear}
          className="mt-2 text-sm text-brand-600 dark:text-brand-400 hover:underline"
        >
          Xem tất cả bài học
        </button>
      </div>
    )
  }

  if (filter === 'todo') {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-4xl">🎉</p>
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Bạn đã hoàn thành tất cả bài học!
        </p>
        <p className="text-sm text-gray-400">Thử luyện tập tổng hợp để củng cố kiến thức.</p>
        <Link
          to="/practice"
          className="inline-block mt-2 text-sm text-brand-600 dark:text-brand-400 hover:underline"
        >
          Đến trang luyện tập →
        </Link>
      </div>
    )
  }

  return null
}
