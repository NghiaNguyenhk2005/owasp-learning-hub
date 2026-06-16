/**
 * quizService — logic chấm điểm trắc nghiệm.
 * Hoàn toàn pure functions, không có side effect → dễ unit test.
 */

/**
 * Kiểm tra đáp án của một câu hỏi
 * @param {number} selected - index đáp án người dùng chọn
 * @param {number} correct  - index đáp án đúng
 * @returns {{ isCorrect: boolean, explanation: string }}
 */
export function checkAnswer(selected, correct, explanation = '') {
  return {
    isCorrect: selected === correct,
    explanation,
  }
}

/**
 * Tính điểm từ danh sách kết quả
 * @param {{ isCorrect: boolean }[]} results
 * @returns {{ score: number, total: number, percent: number }}
 */
export function calculateScore(results) {
  const total = results.length
  const score = results.filter((r) => r.isCorrect).length
  const percent = total === 0 ? 0 : Math.round((score / total) * 100)
  return { score, total, percent }
}

/**
 * Tạo đề thi ngẫu nhiên từ danh sách bài học
 * @param {Lesson[]} lessons
 * @param {number} count - số câu hỏi muốn lấy
 * @returns {{ lessonId: string, quiz: QuizItem }[]}
 */
export function generatePracticeSet(lessons, count = 10) {
  const pool = lessons
    .filter((l) => l.quiz)
    .map((l) => ({ lessonId: l.id, quiz: l.quiz }))

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, count)
}
