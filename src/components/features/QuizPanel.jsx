import { useState } from 'react'
import { checkAnswer } from '@/services/quizService'
import Toast from '@/components/ui/Toast'

/**
 * Panel trắc nghiệm cho một bài học
 * Props: quiz, lessonId, onComplete(score: number)
 */
export default function QuizPanel({ quiz, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null) // { isCorrect, explanation }
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (selected === null) return
    const res = checkAnswer(selected, quiz.correct, quiz.explanation)
    setResult(res)
    setSubmitted(true)
    // score: 100 nếu đúng, 0 nếu sai (có thể mở rộng multi-question sau)
    onComplete?.(res.isCorrect ? 100 : 0)
  }

  function handleRetry() {
    setSelected(null)
    setResult(null)
    setSubmitted(false)
  }

  return (
    <div className="space-y-4">
      <p className="font-medium text-gray-800 dark:text-gray-200 text-base leading-relaxed">
        {quiz.question}
      </p>

      <div className="space-y-2">
        {quiz.options.map((opt, idx) => {
          let style =
            'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 '

          if (!submitted) {
            style +=
              selected === idx
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                : 'border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
          } else {
            if (idx === quiz.correct) {
              style += 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 font-medium'
            } else if (idx === selected && !result.isCorrect) {
              style += 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            } else {
              style += 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500'
            }
          }

          return (
            <button
              key={idx}
              onClick={() => !submitted && setSelected(idx)}
              className={style}
              disabled={submitted}
            >
              <span className="font-mono text-xs mr-2 opacity-60">
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {result && (
        <Toast
          type={result.isCorrect ? 'success' : 'error'}
          message={
            result.isCorrect
              ? `✓ Chính xác! ${result.explanation}`
              : `✗ Chưa đúng. ${result.explanation}`
          }
        />
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            Xác nhận
          </button>
        ) : (
          <button
            onClick={handleRetry}
            className="px-5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors text-gray-700 dark:text-gray-300"
          >
            Làm lại
          </button>
        )}
      </div>
    </div>
  )
}
