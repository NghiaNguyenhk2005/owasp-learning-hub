import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useAppStore from '@/store/useAppStore'
import { getLessonById, getAllLessons } from '@/services/contentService'
import Navbar from '@/components/ui/Navbar'
import Tabs from '@/components/ui/Tabs'
import QuizPanel from '@/components/features/QuizPanel'
import CodeEditor from '@/components/features/CodeEditor'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react'

const TABS = [
  { key: 'concept',       label: '📖 Khái niệm' },
  { key: 'example',       label: '💡 Ví dụ thực tế' },
  { key: 'quiz',          label: '📝 Quiz' },
  { key: 'hackIt',        label: '🔓 Hack It' },
  { key: 'bestPractices', label: '✅ Phòng chống' },
]

export default function LessonPage() {
  const { id } = useParams()
  const { markLesson, progress, initDarkMode } = useAppStore()

  const [lesson, setLesson] = useState(null)
  const [allLessons, setAllLessons] = useState([])
  const [activeTab, setActiveTab] = useState('concept')
  const [loading, setLoading] = useState(true)
  const [justCompleted, setJustCompleted] = useState(false)

  useEffect(() => {
    initDarkMode()
    async function load() {
      setLoading(true)
      const [data, all] = await Promise.all([getLessonById(id), getAllLessons()])
      setLesson(data)
      setAllLessons(all)
      setActiveTab('concept')
      setJustCompleted(false)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Đang tải bài học...</div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Không tìm thấy bài học "{id}".</p>
        <Link to="/" className="text-brand-600 hover:underline">← Về trang chủ</Link>
      </div>
    )
  }

  const allIds = allLessons.map((l) => l.id)
  const currentIdx = allIds.indexOf(id)
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null
  const lessonProgress = progress[id] ?? null
  const isCompleted = lessonProgress?.completed ?? false
  const doneCount = allIds.filter((lid) => progress[lid]?.completed).length

  const visibleTabs = TABS.filter((t) => t.key !== 'hackIt' || lesson.tryAndCode)

  function handleMarkComplete() {
    markLesson(id, { completed: !isCompleted })
    if (!isCompleted) setJustCompleted(true)
  }

  function handleQuizComplete(score) {
    markLesson(id, { completed: true, quizScore: score })
    setJustCompleted(true)
  }

  function handleCodeComplete() {
    markLesson(id, { completed: true })
    setJustCompleted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* Breadcrumb + progress mini */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <ChevronLeft size={16} />
            Trang chủ
          </Link>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {doneCount}/{allIds.length} bài hoàn thành
          </span>
        </div>

        {/* Header bài học */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                  {lesson.id}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {currentIdx + 1} / {allIds.length}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {lesson.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{lesson.shortDesc}</p>
            </div>

            {/* Nút đánh dấu hoàn thành thủ công */}
            <button
              onClick={handleMarkComplete}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                isCompleted
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              {isCompleted
                ? <><CheckCircle2 size={16} /> Hoàn thành</>
                : <><Circle size={16} /> Đánh dấu xong</>
              }
            </button>
          </div>

          {/* Banner chúc mừng */}
          {justCompleted && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
              🎉 Tuyệt vời! Bạn đã hoàn thành bài <strong>{lesson.id} – {lesson.name}</strong>.
              {nextLesson && (
                <Link
                  to={`/lesson/${nextLesson.id}`}
                  className="ml-auto shrink-0 underline underline-offset-2 hover:no-underline"
                >
                  Bài tiếp theo →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs tabs={visibleTabs} active={activeTab} onChange={setActiveTab} />

        {/* Tab content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7 space-y-5">

          {/* ── KHÁI NIỆM ── */}
          {activeTab === 'concept' && (
            <div className="space-y-5">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                {lesson.concept}
              </p>
              {lesson.conceptDetails && (
                <div className="space-y-3">
                  {lesson.conceptDetails.map((block, i) => (
                    <ContentBlock key={i} block={block} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── VÍ DỤ THỰC TẾ ── */}
          {activeTab === 'example' && (
            <div className="space-y-5">
              {lesson.examples?.map((ex, i) => (
                <div key={i} className="space-y-3">
                  {i > 0 && <hr className="border-gray-100 dark:border-gray-800" />}
                  {ex.title && (
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{ex.title}</h3>
                  )}
                  {ex.text && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{ex.text}</p>
                  )}
                  {ex.code && <CodeBlock code={ex.code} language={ex.language ?? 'sql'} />}
                  {ex.note && (
                    <div className="flex gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
                      <span>⚠️</span>
                      <span>{ex.note}</span>
                    </div>
                  )}
                </div>
              ))}
              {!lesson.examples && (
                <p className="text-gray-400 text-sm">Bài học này chưa có ví dụ.</p>
              )}
            </div>
          )}

          {/* ── QUIZ ── */}
          {activeTab === 'quiz' && (
            lesson.quiz
              ? <QuizPanel quiz={lesson.quiz} lessonId={id} onComplete={handleQuizComplete} />
              : <p className="text-gray-400 text-sm">Bài học này chưa có quiz.</p>
          )}

          {/* ── HACK IT ── */}
          {activeTab === 'hackIt' && lesson.tryAndCode && (
            <CodeEditor tryAndCode={lesson.tryAndCode} lessonId={id} onComplete={handleCodeComplete} />
          )}

          {/* ── PHÒNG CHỐNG ── */}
          {activeTab === 'bestPractices' && (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {lesson.bestPractices}
              </p>
              {lesson.bestPracticesList && (
                <ul className="space-y-2">
                  {lesson.bestPracticesList.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Prev / Next navigation */}
        <div className="flex justify-between mt-8 gap-4">
          {prevLesson ? (
            <Link
              to={`/lesson/${prevLesson.id}`}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-400 dark:hover:border-brand-600 text-sm text-gray-600 dark:text-gray-300 transition-colors group"
            >
              <ChevronLeft size={16} className="shrink-0 group-hover:text-brand-500" />
              <div className="min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Bài trước</p>
                <p className="font-medium truncate">{prevLesson.id} – {prevLesson.name}</p>
              </div>
            </Link>
          ) : <div className="flex-1" />}

          {nextLesson ? (
            <Link
              to={`/lesson/${nextLesson.id}`}
              className="flex-1 flex items-center justify-end gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-400 dark:hover:border-brand-600 text-sm text-gray-600 dark:text-gray-300 transition-colors group text-right"
            >
              <div className="min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Bài tiếp theo</p>
                <p className="font-medium truncate">{nextLesson.id} – {nextLesson.name}</p>
              </div>
              <ChevronRight size={16} className="shrink-0 group-hover:text-brand-500" />
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </main>
    </div>
  )
}

// ── Helper components ──────────────────────────────────────────────────────

function CodeBlock({ code, language = 'sql' }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          {copied ? '✓ Đã copy' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-50 dark:bg-gray-900 px-5 py-4 text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto leading-relaxed whitespace-pre">
        {code}
      </pre>
    </div>
  )
}

function ContentBlock({ block }) {
  if (block.type === 'text') {
    return <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{block.content}</p>
  }
  if (block.type === 'code') {
    return <CodeBlock code={block.content} language={block.language} />
  }
  if (block.type === 'callout') {
    const styles = {
      info:    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
      warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
      danger:  'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    }
    const icons = { info: 'ℹ️', warning: '⚠️', danger: '🚨' }
    return (
      <div className={`flex gap-3 px-4 py-3 rounded-xl border text-sm leading-relaxed ${styles[block.variant ?? 'info']}`}>
        <span className="shrink-0">{icons[block.variant ?? 'info']}</span>
        <span>{block.content}</span>
      </div>
    )
  }
  return null
}
