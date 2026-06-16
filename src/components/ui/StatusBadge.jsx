/**
 * Badge hiển thị trạng thái hoàn thành của bài học
 */
export default function StatusBadge({ completed }) {
  if (completed) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
        ✓ Hoàn thành
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      Chưa học
    </span>
  )
}
