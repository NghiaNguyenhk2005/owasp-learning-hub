import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LessonPage from '@/pages/LessonPage'
import PracticePage from '@/pages/PracticePage'
import NotFoundPage from '@/pages/NotFoundPage'
import BackToTop from '@/components/ui/BackToTop'
import { ScrollToTop } from '@/utils/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/"            element={<HomePage />}     />
        <Route path="/lesson/:id"  element={<LessonPage />}   />
        <Route path="/practice"    element={<PracticePage />} />
        <Route path="*"            element={<NotFoundPage />} />
      </Routes>
      <BackToTop />
    </>
  )
}
