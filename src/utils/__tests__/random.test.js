import { describe, it, expect } from 'vitest'
import { shuffle, sample } from '../random'

describe('random utils', () => {
  it('shuffle không làm mất phần tử', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = shuffle(arr)
    expect(result).toHaveLength(arr.length)
    expect([...result].sort()).toEqual([...arr].sort())
  })

  it('shuffle không mutate mảng gốc', () => {
    const arr = [1, 2, 3]
    const copy = [...arr]
    shuffle(arr)
    expect(arr).toEqual(copy)
  })

  it('sample trả về đúng số lượng', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(sample(arr, 3)).toHaveLength(3)
  })

  it('sample không trả về nhiều hơn input', () => {
    const arr = [1, 2]
    expect(sample(arr, 10)).toHaveLength(2)
  })
})
