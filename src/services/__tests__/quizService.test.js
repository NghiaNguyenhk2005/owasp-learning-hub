import { describe, it, expect, beforeEach } from 'vitest'
import {
  checkAnswer,
  calculateScore,
  generatePracticeSet,
} from '../quizService'

describe('quizService', () => {
  describe('checkAnswer', () => {
    it('trả về isCorrect=true khi chọn đúng', () => {
      const result = checkAnswer(1, 1, 'Giải thích')
      expect(result.isCorrect).toBe(true)
      expect(result.explanation).toBe('Giải thích')
    })

    it('trả về isCorrect=false khi chọn sai', () => {
      const result = checkAnswer(0, 2)
      expect(result.isCorrect).toBe(false)
    })
  })

  describe('calculateScore', () => {
    it('tính đúng phần trăm', () => {
      const results = [
        { isCorrect: true },
        { isCorrect: false },
        { isCorrect: true },
        { isCorrect: true },
      ]
      const { score, total, percent } = calculateScore(results)
      expect(score).toBe(3)
      expect(total).toBe(4)
      expect(percent).toBe(75)
    })

    it('trả về 0 khi không có câu nào', () => {
      const { percent } = calculateScore([])
      expect(percent).toBe(0)
    })
  })

  describe('generatePracticeSet', () => {
    const mockLessons = [
      { id: 'A01', quiz: { question: 'Q1' } },
      { id: 'A02', quiz: { question: 'Q2' } },
      { id: 'A03', quiz: null },
      { id: 'A04', quiz: { question: 'Q4' } },
    ]

    it('chỉ lấy bài có quiz', () => {
      const set = generatePracticeSet(mockLessons, 10)
      expect(set.every((item) => item.quiz !== null)).toBe(true)
    })

    it('không trả về quá số lượng yêu cầu', () => {
      const set = generatePracticeSet(mockLessons, 2)
      expect(set.length).toBeLessThanOrEqual(2)
    })

    it('mỗi item có lessonId và quiz', () => {
      const set = generatePracticeSet(mockLessons, 3)
      set.forEach((item) => {
        expect(item).toHaveProperty('lessonId')
        expect(item).toHaveProperty('quiz')
      })
    })
  })
})
