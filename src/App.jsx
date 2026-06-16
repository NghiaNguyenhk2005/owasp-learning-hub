import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LessonPage from '@/pages/LessonPage'
import PracticePage from '@/pages/PracticePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lesson/:id" element={<LessonPage />} />
      <Route path="/practice" element={<PracticePage />} />
    </Routes>
  )
}
