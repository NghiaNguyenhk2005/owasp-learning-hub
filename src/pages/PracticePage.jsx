import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAppStore from '@/store/useAppStore'
import { getAllLessons } from '@/services/contentService'
import { generatePracticeSet, checkAnswer, calculateScore } from '@/services/quizService'
import { saveProgress } from '@/services/progressService'
import { useConfetti } from '@/utils/useConfetti'
import Navbar from '@/components/ui/Navbar'
import ProgressBar from '@/components/ui/ProgressBar'
import { getSeverityStyles } from '@/utils/severity'
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen } from 'lucide-react'

const STATES = { SETUP: 'setup', PLAYING: 'playing', RESULT: 'result' }

export default function PracticePage() {
  const { initDarkMode, loadLessons } = useAppStore()
  const fireConfetti = useConfetti()

  const [allLessons, setAllLessons]   = useState([])
  const [questionCount, setQuestionCount] = useState(5)
  const [practiceSet, setPracticeSet] = useState([])
  const [currentIdx, setCurrentIdx]   = useState(0)
  const [selected, setSelected]       = useState(null)
  const [submitted, setSubmitted]     = useState(false)
  const [answers, setAnswers]         = useState([])
  const [state, setState]             = useState(STATES.SETUP)

  useEffect(() => {
    initDarkMode()
    getAllLessons().then(setAllLessons)
  }, [])

  const availableCount = allLessons.filter((l) => l.quiz).length
  const current        = practiceSet[currentIdx]
  const playProgress   = answers.length > 0 ? Math.round((answers.length / practiceSet.length) * 100) : 0
  const finalScore     = calculateScore(answers)
  const wrongAnswers   = answers.filter((a) => !a.isCorrect)

  function handleStart() {
    const set = generatePracticeSet(allLessons, questionCount)
    setPracticeSet(set)
    setCurrentIdx(0)
    setAnswers([])
    setSelected(null)
    setSubmitted(false)
    setState(STATES.PLAYING)
  }

  function handleSubmit() {
    if (selected === null) return
    const res = checkAnswer(selected, current.quiz.correct, current.quiz.explanation)
    const newAnswers = [...answers, { ...res, lessonId: current.lessonId, question: current.quiz.question }]
    setAnswers(newAnswers)
    setSubmitted(true)
    if (res.isCorrect) {
      saveProgress(current.lessonId, { completed: true, quizScore: 100 })
      loadLessons()
    }
  }

  function handleNext() {
    if (currentIdx + 1 >= practiceSet.length) {
      setState(STATES.RESULT)
      if (finalScore.percent >= 80) fireConfetti()
    } else {
      setCurrentIdx((i) => i + 1)
      setSelected(null)
      setSubmitted(false)
    }
  }

  function handleRestart() {
    setState(STATES.SETUP)
    setPracticeSet([])
    setAnswers([])
    setCurrentIdx(0)
    setSelected(null)
    setSubmitted(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10 page-enter">

        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Trang chủ
        </Link>

        {/* ── SETUP ── */}
        {state === STATES.SETUP && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🎯 Luyện tập tổng hợp</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Câu hỏi ngẫu nhiên từ tất cả bài học. Kiểm tra kiến thức của bạn.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Số câu hỏi</label>
                <div className="flex gap-2">
                  {[3, 5, 10].filter((n) => n <= availableCount).map((n) => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                        questionCount === n
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-400'
                      }`}
                    >
                      {n} câu
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Hiện có {availableCount} câu hỏi.</p>
              </div>
              <button
                onClick={handleStart}
                disabled={availableCount === 0}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-medium transition-colors"
              >
                Bắt đầu
              </button>
            </div>
          </div>
        )}

        {/* ── PLAYING ── */}
        {state === STATES.PLAYING && current && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Câu {currentIdx + 1} / {practiceSet.length}
              </span>
              <span className={`text-xs font-mono px-2 py-1 rounded-lg ${getSeverityStyles(current.lessonId).badge}`}>
                {current.lessonId}
              </span>
            </div>
            <ProgressBar percent={playProgress} />

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
              <p className="font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                {current.quiz.question}
              </p>

              <div className="space-y-2">
                {current.quiz.options.map((opt, idx) => {
                  let style = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 '
                  if (!submitted) {
                    style += selected === idx
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-brand-400 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                  } else {
                    if (idx === current.quiz.correct)
                      style += 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 font-medium'
                    else if (idx === selected)
                      style += 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    else
                      style += 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500'
                  }
                  return (
                    <button key={idx} onClick={() => !submitted && setSelected(idx)} disabled={submitted} className={style}>
                      <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {submitted && (
                <div className={`px-4 py-3 rounded-xl border text-sm leading-relaxed ${
                  answers[answers.length - 1]?.isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                }`}>
                  {answers[answers.length - 1]?.isCorrect ? '✓ Chính xác! ' : '✗ Chưa đúng. '}
                  {current.quiz.explanation}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                {!submitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={selected === null}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-sm font-medium transition-colors"
                  >
                    Xác nhận
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {currentIdx + 1 >= practiceSet.length ? 'Xem kết quả' : 'Câu tiếp theo'}
                    <ChevronRight size={16} />
                  </button>
                )}
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Thoát
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {state === STATES.RESULT && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center space-y-4">
              <div className="text-5xl">
                {finalScore.percent >= 80 ? '🏆' : finalScore.percent >= 50 ? '💪' : '📚'}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {finalScore.score}/{finalScore.total}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {finalScore.percent >= 80 ? 'Xuất sắc! Bạn nắm vững kiến thức này.'
                    : finalScore.percent >= 50 ? 'Khá tốt! Ôn lại những bài làm sai nhé.'
                    : 'Cần ôn thêm. Đọc lại lý thuyết và thử lại.'}
                </p>
              </div>
              <div className="max-w-xs mx-auto">
                <ProgressBar percent={finalScore.percent} />
              </div>
            </div>

            {/* Ôn lại bài sai */}
            {wrongAnswers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 px-1 flex items-center gap-2">
                  <BookOpen size={14} />
                  Ôn lại bài làm sai ({wrongAnswers.length} bài)
                </p>
                {wrongAnswers.map((ans, i) => {
                  const styles = getSeverityStyles(ans.lessonId)
                  return (
                    <Link
                      key={i}
                      to={`/lesson/${ans.lessonId}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group"
                    >
                      <span className="text-red-500 shrink-0">✗</span>
                      <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${styles.badge}`}>
                        {ans.lessonId}
                      </span>
                      <span className="text-sm text-red-800 dark:text-red-300 flex-1 truncate">
                        {ans.explanation}
                      </span>
                      <span className="text-xs text-red-400 dark:text-red-500 shrink-0 group-hover:text-brand-500 transition-colors">
                        Ôn lại →
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Chi tiết tất cả câu */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 px-1">Toàn bộ kết quả</p>
              {answers.map((ans, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
                    ans.isCorrect
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                  }`}
                >
                  <span className={ans.isCorrect ? 'text-green-600' : 'text-red-500'}>{ans.isCorrect ? '✓' : '✗'}</span>
                  <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${getSeverityStyles(ans.lessonId).badge}`}>
                    {ans.lessonId}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{ans.explanation}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
              >
                <RotateCcw size={16} /> Làm lại
              </button>
              <Link
                to="/"
                className="flex-1 flex items-center justify-center py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
