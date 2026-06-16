/**
 * progressService — lưu và đọc tiến độ học tập.
 * Hiện tại dùng localStorage.
 * Để swap sang backend: chỉ cần thay đổi _get/_set bên dưới.
 */

const STORAGE_KEY = 'owasp_hub_progress'

function _get() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function _set(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/**
 * Lưu tiến độ của một bài học
 * @param {string} lessonId
 * @param {{ completed: boolean, quizScore?: number, lastVisited: number }} payload
 */
export function saveProgress(lessonId, payload) {
  const all = _get()
  all[lessonId] = { ...all[lessonId], ...payload, lastVisited: Date.now() }
  _set(all)
}

/**
 * Lấy tiến độ của một bài học
 * @param {string} lessonId
 * @returns {{ completed: boolean, quizScore?: number, lastVisited?: number } | null}
 */
export function getProgress(lessonId) {
  return _get()[lessonId] ?? null
}

/**
 * Lấy toàn bộ tiến độ
 * @returns {Record<string, object>}
 */
export function getAllProgress() {
  return _get()
}

/**
 * Tính phần trăm hoàn thành (0–100)
 * @param {string[]} allLessonIds
 * @returns {number}
 */
export function calcCompletionPercent(allLessonIds) {
  const all = _get()
  const done = allLessonIds.filter((id) => all[id]?.completed).length
  return allLessonIds.length === 0 ? 0 : Math.round((done / allLessonIds.length) * 100)
}

/**
 * Reset toàn bộ tiến độ
 */
export function resetProgress() {
  _set({})
}

/**
 * Xuất tiến độ ra chuỗi JSON (để người dùng download)
 * @returns {string}
 */
export function exportProgress() {
  return JSON.stringify(_get(), null, 2)
}
