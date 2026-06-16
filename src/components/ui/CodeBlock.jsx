import { useEffect, useRef, useState } from 'react'
import hljs from 'highlight.js/lib/core'

// Chỉ import ngôn ngữ cần dùng để giảm bundle size
import javascript from 'highlight.js/lib/languages/javascript'
import sql        from 'highlight.js/lib/languages/sql'
import python     from 'highlight.js/lib/languages/python'
import bash       from 'highlight.js/lib/languages/bash'
import json       from 'highlight.js/lib/languages/json'
import http       from 'highlight.js/lib/languages/http'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('sql',        sql)
hljs.registerLanguage('python',     python)
hljs.registerLanguage('bash',       bash)
hljs.registerLanguage('json',       json)
hljs.registerLanguage('http',       http)

// Map alias
const LANG_ALIAS = { js: 'javascript', py: 'python', sh: 'bash' }

export default function CodeBlock({ code, language = 'plaintext' }) {
  const codeRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const lang = LANG_ALIAS[language] ?? language

  useEffect(() => {
    if (!codeRef.current) return
    // Reset để tránh double-highlight
    codeRef.current.removeAttribute('data-highlighted')
    codeRef.current.className = `language-${lang}`
    codeRef.current.textContent = code
    hljs.highlightElement(codeRef.current)
  }, [code, lang])

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 text-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {/* macOS-style dots */}
          <span className="w-3 h-3 rounded-full bg-red-400 opacity-70" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-70" />
          <span className="w-3 h-3 rounded-full bg-green-400 opacity-70" />
          <span className="ml-2 text-xs font-mono text-gray-400 uppercase tracking-wider">{lang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto bg-gray-50 dark:bg-gray-950">
        <pre className="px-5 py-4 leading-relaxed m-0 !bg-transparent">
          <code ref={codeRef} className={`language-${lang} !bg-transparent`} />
        </pre>
      </div>
    </div>
  )
}
