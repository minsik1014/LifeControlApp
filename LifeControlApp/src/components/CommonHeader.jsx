import { Link } from 'react-router-dom';

export default function CommonHeader() {
  return (
    <header className="bg-[#141414] shadow-md p-4 flex justify-center space-x-10 text-gray-300 font-semibold text-lg">
      <Link to="/" className="hover:text-white transition">Home</Link>
      <Link to="/books" className="hover:text-white transition">책 리뷰</Link>
      <Link to="/movies" className="hover:text-white transition">영화 리뷰</Link>
      <Link to="/workout" className="hover:text-white transition">운동 기록</Link>
      <Link to="/calendar" className="hover:text-white transition">캘린더</Link>
      <Link to="/diary" className="hover:text-white transition">일기</Link>
    </header>
  );
}
