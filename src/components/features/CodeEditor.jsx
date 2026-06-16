import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { executeSql, executeJs } from '@/services/sandboxService'
import Toast from '@/components/ui/Toast'
import useAppStore from '@/store/useAppStore'

/**
 * Sandbox editor cho Try & Code
 * Props: tryAndCode (object từ owasp.json), lessonId, onComplete()
 */
export default function CodeEditor({ tryAndCode, lessonId, onComplete }) {
  const darkMode = useAppStore((s) => s.darkMode)
  const [code, setCode] = useState(tryAndCode.initialCode)
  const [running, setRunning] = useState(false)
  const [feedback, setFeedback] = useState(null) // { type, message, details }
  const [showSolution, setShowSolution] = useState(false)

  const language = tryAndCode.language // 'sql' | 'javascript'

  async function handleRun() {
    setRunning(true)
    setFeedback(null)

    try {
      let result

      if (language === 'sql') {
        result = await executeSql(code, tryAndCode.setupSql ?? '')
        if (result.error) {
          setFeedback({ type: 'error', message: `Lỗi SQL: ${result.error}` })
        } else {
          const rowCount = result.output?.values?.length ?? 0
          setFeedback({
            type: 'info',
            message: `Truy vấn trả về ${rowCount} dòng.`,
            details: result.output,
          })
          // SQL bài tập: thành công khi lấy được nhiều hơn 1 row (khai thác injection)
          if (rowCount > 1) {
            setFeedback({
              type: 'success',
              message: `🎉 Khai thác thành công! Truy vấn trả về ${rowCount} dòng — bạn đã vượt qua xác thực.`,
              details: result.output,
            })
            onComplete?.()
          }
        }
      } else if (language === 'javascript') {
        result = await executeJs(code, tryAndCode.testCases ?? [])
        if (result.error) {
          setFeedback({ type: 'error', message: `Lỗi: ${result.error}` })
        } else {
          const passed = result.output.filter((r) => r.passed).length
          const total = result.output.length
          if (result.success) {
            setFeedback({
              type: 'success',
              message: `🎉 Tất cả ${total}/${total} test cases đều pass!`,
              details: result.output,
            })
            onComplete?.()
          } else {
            setFeedback({
              type: 'error',
              message: `${passed}/${total} test cases pass. Kiểm tra lại logic của bạn.`,
              details: result.output,
            })
          }
        }
      }
    } finally {
      setRunning(false)
    }
  }

  function handleReset() {
    setCode(tryAndCode.initialCode)
    setFeedback(null)
    setShowSolution(false)
  }

  return (
    <div className="space-y-4">
      {/* Description */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
        {tryAndCode.description}
        {tryAndCode.hint && (
          <details className="mt-2">
            <summary className="cursor-pointer opacity-70 hover:opacity-100 select-none">💡 Gợi ý</summary>
            <p className="mt-1 opacity-80">{tryAndCode.hint}</p>
          </details>
        )}
      </div>

      {/* Editor */}
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {language}
          </span>
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>
        <Editor
          height="220px"
          language={language === 'sql' ? 'sql' : 'javascript'}
          value={code}
          onChange={(val) => setCode(val ?? '')}
          theme={darkMode ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="space-y-2">
          <Toast
            type={feedback.type}
            message={feedback.message}
            onClose={() => setFeedback(null)}
          />
          {/* Test case details */}
          {feedback.details && language === 'javascript' && Array.isArray(feedback.details) && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-xs font-mono">
              {feedback.details.map((tc, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-2 border-b last:border-0 border-gray-100 dark:border-gray-800 ${
                    tc.passed ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'
                  }`}
                >
                  <span>{tc.passed ? '✓' : '✗'}</span>
                  <span className="text-gray-500">input: {JSON.stringify(tc.input)}</span>
                  <span className="text-gray-500">expected: {JSON.stringify(tc.expected)}</span>
                  <span className={tc.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    got: {JSON.stringify(tc.actual)}
                  </span>
                </div>
              ))}
            </div>
          )}
          {/* SQL result table */}
          {feedback.details && language === 'sql' && feedback.details.columns && (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="text-xs w-full">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    {feedback.details.columns.map((col, i) => (
                      <th key={i} className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feedback.details.values.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 text-gray-700 dark:text-gray-300 font-mono">
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleRun}
          disabled={running}
          className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {running ? 'Đang chạy...' : '▶ Chạy'}
        </button>
        {tryAndCode.solution && (
          <button
            onClick={() => setShowSolution((v) => !v)}
            className="px-5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors text-gray-600 dark:text-gray-300"
          >
            {showSolution ? 'Ẩn đáp án' : 'Xem đáp án'}
          </button>
        )}
      </div>

      {/* Solution */}
      {showSolution && tryAndCode.solution && (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wider">Đáp án</p>
          <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {tryAndCode.solution}
          </pre>
        </div>
      )}
    </div>
  )
}
