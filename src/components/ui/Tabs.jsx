/**
 * Tabs component — dùng lại được ở nhiều nơi
 * Props:
 *   tabs: { key: string, label: string, done?: boolean }[]
 *   active: string
 *   onChange: (key: string) => void
 */
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800 mb-6 pb-0 scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
            active === tab.key
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
          {tab.done && (
            <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-green-500 align-middle" />
          )}
        </button>
      ))}
    </div>
  )
}
