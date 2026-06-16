/**
 * Ước tính thời gian đọc một bài học
 * Dựa trên tổng lượng text + có sandbox hay không
 */
export function estimateReadingTime(lesson) {
  if (!lesson) return 1

  const texts = [
    lesson.concept ?? '',
    ...(lesson.conceptDetails ?? []).map((b) => b.content ?? ''),
    ...(lesson.examples ?? []).flatMap((e) => [e.text ?? '', e.code ?? '']),
    lesson.bestPractices ?? '',
    ...(lesson.bestPracticesList ?? []),
    lesson.quiz?.question ?? '',
  ].join(' ')

  const wordCount  = texts.trim().split(/\s+/).length
  const readingMin = Math.ceil(wordCount / 200)           // ~200 từ/phút
  const labMin     = lesson.tryAndCode ? 3 : 0            // +3 phút nếu có sandbox
  const quizMin    = lesson.quiz ? 1 : 0                  // +1 phút nếu có quiz

  return Math.max(1, readingMin + labMin + quizMin)
}
