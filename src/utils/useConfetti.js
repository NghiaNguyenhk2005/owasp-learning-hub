import { useCallback } from 'react'

export function useConfetti() {
  const fire = useCallback(async () => {
    try {
      const confetti = (await import('canvas-confetti')).default
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6'],
      })
    } catch {
      // canvas-confetti chưa install — silent fail
    }
  }, [])
  return fire
}
