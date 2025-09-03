import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import BookReviewPage from './pages/BookReviewPage';
import MovieReviewPage from './pages/MovieReviewPage';
import WorkoutPage from './pages/WorkoutPage';
import CalendarPage from './pages/CalendarPage';
import DiaryPage from './pages/DiaryPage';
import CommonHeader from './components/CommonHeader';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 메인페이지에서는 네비바 숨김 */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="*"
          element={
            <>
              <CommonHeader />
              <Routes>
                <Route path="/books" element={<BookReviewPage />} />
                <Route path="/movies" element={<MovieReviewPage />} />
                <Route path="/workout" element={<WorkoutPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/diary" element={<DiaryPage />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
}
