import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveProgress,
  getProgress,
  getAllProgress,
  calcCompletionPercent,
  resetProgress,
  exportProgress,
} from '../progressService'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value) },
    clear: () => { store = {} },
  }
})()

vi.stubGlobal('localStorage', localStorageMock)

describe('progressService', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('saveProgress và getProgress hoạt động đúng', () => {
    saveProgress('A01', { completed: true, quizScore: 80 })
    const p = getProgress('A01')
    expect(p.completed).toBe(true)
    expect(p.quizScore).toBe(80)
    expect(p.lastVisited).toBeTypeOf('number')
  })

  it('getProgress trả về null nếu chưa có', () => {
    expect(getProgress('A99')).toBeNull()
  })

  it('calcCompletionPercent tính đúng', () => {
    saveProgress('A01', { completed: true })
    saveProgress('A02', { completed: false })
    saveProgress('A03', { completed: true })
    const percent = calcCompletionPercent(['A01', 'A02', 'A03'])
    expect(percent).toBe(67)
  })

  it('resetProgress xóa toàn bộ', () => {
    saveProgress('A01', { completed: true })
    resetProgress()
    expect(getProgress('A01')).toBeNull()
  })

  it('exportProgress trả về JSON hợp lệ', () => {
    saveProgress('A01', { completed: true })
    const json = exportProgress()
    const parsed = JSON.parse(json)
    expect(parsed).toHaveProperty('A01')
  })
})
