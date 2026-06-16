import { Link } from 'react-router-dom'
import Navbar from '@/components/ui/Navbar'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-24 text-center page-enter">
        <div className="text-7xl mb-6 select-none">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Trang không tồn tại
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
          URL bạn nhập không hợp lệ hoặc trang này đã bị xóa.
          Quay về trang chủ để tiếp tục học.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
        >
          ← Về trang chủ
        </Link>
      </main>
    </div>
  )
}
