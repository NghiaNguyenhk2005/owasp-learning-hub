export default function ProgressBar({ percent = 0, label = '' }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-400">
          <span>{label}</span>
          <span className="font-semibold text-brand-600 dark:text-brand-400">{percent}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
