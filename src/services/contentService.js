/**
 * contentService — nguồn dữ liệu duy nhất cho nội dung OWASP.
 * Hiện tại load từ JSON tĩnh.
 * Sau này chỉ cần đổi phần này để fetch từ API, không đụng đến component.
 */

let _cache = null

async function _load() {
  if (_cache) return _cache
  const mod = await import('@/data/owasp.json', { assert: { type: 'json' } })
  _cache = mod.default
  return _cache
}

/**
 * Lấy tất cả bài học
 * @returns {Promise<Lesson[]>}
 */
export async function getAllLessons() {
  const data = await _load()
  return data.lessons
}

/**
 * Lấy một bài học theo ID (vd: "A01")
 * @param {string} id
 * @returns {Promise<Lesson | null>}
 */
export async function getLessonById(id) {
  const lessons = await getAllLessons()
  return lessons.find((l) => l.id === id) ?? null
}

/**
 * Lấy danh sách ID của tất cả bài học
 * @returns {Promise<string[]>}
 */
export async function getAllLessonIds() {
  const lessons = await getAllLessons()
  return lessons.map((l) => l.id)
}
