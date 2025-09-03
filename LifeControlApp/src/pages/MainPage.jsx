import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();

  const menuItems = [
    { label: '책 리뷰', path: '/books' },
    { label: '영화 리뷰', path: '/movies' },
    { label: '운동 기록', path: '/workout' },
    { label: '캘린더', path: '/calendar' },
    { label: '일기', path: '/diary' },
  ];

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-extrabold mb-12">Life Control App</h1>
      <div className="flex space-x-12">
        {menuItems.map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="w-40 h-40 bg-[#222] rounded-md flex items-center justify-center text-xl font-semibold hover:bg-[#e50914] transition-shadow shadow-md"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
