import { useState, useEffect } from 'react'
import {
  getPlan,
  savePlan,
  clearPlan,
  getPlanStatus,
  requestNotificationPermission,
  sendReminder,
} from '@/services/planningService'
import useAppStore from '@/store/useAppStore'

/**
 * Panel lập kế hoạch học tập — dùng trên HomePage
 */
export default function PlanningPanel() {
  const { completionPercent } = useAppStore()
  const [plan, setPlan] = useState(null)
  const [goalInput, setGoalInput] = useState(7)
  const [notifyEnabled, setNotifyEnabled] = useState(false)
  const [notifySupported] = useState('Notification' in window)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = getPlan()
    if (saved) {
      setPlan(saved)
      setGoalInput(saved.goal)
      setNotifyEnabled(saved.notifyEnabled)
    }
  }, [])

  async function handleSave() {
    setSaving(true)
    let notify = notifyEnabled
    if (notifyEnabled) {
      notify = await requestNotificationPermission()
    }
    const newPlan = {
      goal: goalInput,
      startDate: plan?.startDate ?? new Date().toISOString(),
      notifyEnabled: notify,
    }
    savePlan(newPlan)
    setPlan(newPlan)
    if (notify) sendReminder(getPlanStatus(newPlan).daysLeft, completionPercent)
    setSaving(false)
    setOpen(false)
  }

  function handleClear() {
    clearPlan()
    setPlan(null)
    setGoalInput(7)
    setNotifyEnabled(false)
  }

  const status = plan ? getPlanStatus(plan) : null

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-base">📅</span>
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
            Kế hoạch học tập
          </h2>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
        >
          {plan ? 'Chỉnh sửa' : 'Thiết lập'}
        </button>
      </div>

      {/* Status hiện tại */}
      {plan && status && !open && (
        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Mục tiêu</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {plan.goal} ngày
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Deadline</span>
            <span className={`font-medium ${status.isOverdue ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
              {status.deadline.toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Còn lại</span>
            <span className={`font-medium ${
              status.isOverdue
                ? 'text-red-500'
                : status.daysLeft <= 2
                ? 'text-amber-500'
                : 'text-green-600 dark:text-green-400'
            }`}>
              {status.isOverdue
                ? `Quá hạn ${Math.abs(status.daysLeft)} ngày`
                : `${status.daysLeft} ngày`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Thông báo</span>
            <span className="text-gray-700 dark:text-gray-300">
              {plan.notifyEnabled ? '✓ Bật' : 'Tắt'}
            </span>
          </div>
          <button
            onClick={handleClear}
            className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Xóa kế hoạch
          </button>
        </div>
      )}

      {/* Chưa có plan */}
      {!plan && !open && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Đặt mục tiêu hoàn thành trong X ngày để nhận nhắc nhở.
        </p>
      )}

      {/* Form thiết lập */}
      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Hoàn thành trong
            </label>
            <div className="flex gap-2">
              {[3, 7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setGoalInput(d)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-colors ${
                    goalInput === d
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-brand-400'
                  }`}
                >
                  {d} ngày
                </button>
              ))}
            </div>
          </div>

          {notifySupported && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notifyEnabled}
                  onChange={(e) => setNotifyEnabled(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${notifyEnabled ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifyEnabled ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Nhắc nhở qua browser notification
              </span>
            </label>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu kế hoạch'}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
