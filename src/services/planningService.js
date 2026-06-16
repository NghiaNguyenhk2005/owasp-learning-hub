/**
 * planningService — quản lý kế hoạch học tập
 * Lưu vào localStorage, gửi browser notification
 */

const PLAN_KEY = 'owasp_hub_plan'

/**
 * @typedef {{ goal: number, startDate: string, notifyEnabled: boolean }} Plan
 */

export function getPlan() {
  try {
    return JSON.parse(localStorage.getItem(PLAN_KEY) ?? 'null')
  } catch {
    return null
  }
}

export function savePlan(plan) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan))
}

export function clearPlan() {
  localStorage.removeItem(PLAN_KEY)
}

/**
 * Tính ngày deadline dựa vào startDate và goal (số ngày)
 * @returns {{ daysLeft: number, deadline: Date, isOverdue: boolean }}
 */
export function getPlanStatus(plan) {
  const start = new Date(plan.startDate)
  const deadline = new Date(start)
  deadline.setDate(deadline.getDate() + plan.goal)
  const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))
  return { daysLeft, deadline, isOverdue: daysLeft < 0 }
}

/**
 * Yêu cầu quyền notification
 * @returns {Promise<boolean>}
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

/**
 * Gửi browser notification nhắc nhở học bài
 */
export function sendReminder(daysLeft, completionPercent) {
  if (Notification.permission !== 'granted') return
  const message =
    daysLeft <= 0
      ? `Đã quá deadline! Bạn mới hoàn thành ${completionPercent}% — tiếp tục thôi!`
      : `Còn ${daysLeft} ngày — bạn đã học ${completionPercent}% OWASP Top 10.`
  new Notification('OWASP Learning Hub', {
    body: message,
    icon: '/favicon.ico',
  })
}
