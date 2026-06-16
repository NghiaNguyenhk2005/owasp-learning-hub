/**
 * random.js — pure utility functions, không có side effect
 */

/**
 * Shuffle mảng theo Fisher-Yates (không mutate mảng gốc)
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Lấy n phần tử ngẫu nhiên từ mảng
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T[]}
 */
export function sample(arr, n) {
  return shuffle(arr).slice(0, n)
}
