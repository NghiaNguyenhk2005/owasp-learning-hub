import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 400) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Về đầu trang"
      className="back-to-top-enter fixed bottom-6 right-6 z-50
        w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-700
        text-white shadow-lg shadow-brand-500/30
        flex items-center justify-center
        transition-colors duration-200"
    >
      <ArrowUp size={18} />
    </button>
  )
}
