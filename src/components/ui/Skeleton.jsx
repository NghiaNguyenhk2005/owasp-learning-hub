/** Skeleton pulse block — dùng lại được */
function Bone({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 ${className}`} />
  )
}

export function LessonCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Bone className="h-4 w-10" />
          <Bone className="h-5 w-40" />
        </div>
        <Bone className="h-5 w-20 rounded-full" />
      </div>
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-4/5" />
      <div className="flex gap-2 pt-1">
        <Bone className="h-5 w-12 rounded-full" />
        <Bone className="h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function LessonPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Bone className="h-4 w-24" />
      <div className="space-y-2">
        <div className="flex gap-3">
          <Bone className="h-6 w-12 rounded-lg" />
          <Bone className="h-6 w-8" />
        </div>
        <Bone className="h-8 w-64" />
        <Bone className="h-4 w-96" />
      </div>
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 pb-0">
        {[80, 100, 60, 80, 90].map((w, i) => (
          <Bone key={i} className={`h-10 w-${w === 60 ? 16 : w === 80 ? 20 : 24} rounded-none`} />
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7 space-y-4">
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-5/6" />
        <Bone className="h-4 w-4/5" />
        <Bone className="h-32 w-full rounded-xl mt-4" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-3/4" />
      </div>
    </div>
  )
}
