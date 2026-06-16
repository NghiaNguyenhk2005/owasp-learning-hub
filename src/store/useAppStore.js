import { create } from 'zustand'
import { getAllLessons, getAllLessonIds } from '@/services/contentService'
import {
  getAllProgress,
  saveProgress,
  calcCompletionPercent,
  resetProgress,
} from '@/services/progressService'

const useAppStore = create((set, get) => ({
  // ─── State ───────────────────────────────────────────────────────────────
  lessons: [],
  progress: {},
  completionPercent: 0,
  darkMode: localStorage.getItem('darkMode') === 'true',
  isLoading: false,
  error: null,

  // ─── Actions ─────────────────────────────────────────────────────────────

  /** Load toàn bộ bài học từ contentService */
  loadLessons: async () => {
    set({ isLoading: true, error: null })
    try {
      const lessons = await getAllLessons()
      const ids = lessons.map((l) => l.id)
      const progress = getAllProgress()
      const completionPercent = calcCompletionPercent(ids)
      set({ lessons, progress, completionPercent, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  /** Cập nhật tiến độ cho một bài học */
  markLesson: (lessonId, payload) => {
    saveProgress(lessonId, payload)
    const { lessons } = get()
    const ids = lessons.map((l) => l.id)
    const progress = getAllProgress()
    const completionPercent = calcCompletionPercent(ids)
    set({ progress, completionPercent })
  },

  /** Reset toàn bộ tiến độ */
  resetAllProgress: () => {
    resetProgress()
    const { lessons } = get()
    const ids = lessons.map((l) => l.id)
    set({ progress: {}, completionPercent: calcCompletionPercent(ids) })
  },

  /** Toggle dark mode */
  toggleDarkMode: () => {
    const next = !get().darkMode
    localStorage.setItem('darkMode', String(next))
    document.documentElement.classList.toggle('dark', next)
    set({ darkMode: next })
  },

  /** Init dark mode từ localStorage khi app khởi động */
  initDarkMode: () => {
    const dark = localStorage.getItem('darkMode') === 'true'
    document.documentElement.classList.toggle('dark', dark)
    set({ darkMode: dark })
  },
}))

export default useAppStore
