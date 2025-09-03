import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

function DiaryPage() {
  const [diaries, setDiaries] = useState(() => {
    const saved = localStorage.getItem("diaries");
    return saved ? JSON.parse(saved) : {};
  });

  const [openDate, setOpenDate] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    content: "",
  });

  useEffect(() => {
    localStorage.setItem("diaries", JSON.stringify(diaries));
  }, [diaries]);

  const handleAddClick = () => {
    setIsAdding(true);
    setOpenDate(null);
    setForm({ date: dayjs().format("YYYY-MM-DD"), content: "" });
  };

  const saveDiary = () => {
    if (!form.content.trim()) {
      alert("일기 내용을 입력하세요.");
      return;
    }
    setDiaries((prev) => {
      const copy = { ...prev };
      copy[form.date] = form.content;
      return copy;
    });
    setIsAdding(false);
    setOpenDate(form.date);
  };

  const deleteDiary = (date) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setDiaries((prev) => {
        const copy = { ...prev };
        delete copy[date];
        return copy;
      });
      setOpenDate(null);
    }
  };

  const handleBookClick = (date) => {
    if (openDate === date) {
      setOpenDate(null);
    } else {
      setOpenDate(date);
      setIsAdding(false);
      setForm({ date, content: diaries[date] });
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">일기장</h1>

      {/* 일기책 리스트 */}
      <div className="flex space-x-4 overflow-x-auto mb-8 max-w-full px-2">
        {Object.keys(diaries).length === 0 && (
          <p className="text-gray-400">작성된 일기가 없습니다.</p>
        )}

        {Object.entries(diaries)
          .sort((a, b) => dayjs(a[0]).diff(dayjs(b[0])))
          .map(([date]) => (
            <button
              key={date}
              onClick={() => handleBookClick(date)}
              className={`flex flex-col items-center bg-[#222] rounded-md px-4 py-6 cursor-pointer
                ${
                  openDate === date
                    ? "bg-[#e50914] scale-110 transition-transform"
                    : "hover:bg-[#333] transition-colors"
                }`}
              style={{ minWidth: "80px", userSelect: "none" }}
              title={date}
            >
              <span
                className="text-5xl select-none"
                aria-label="일기책"
                role="img"
              >
                📚
              </span>
              <span className="mt-2 text-sm">{dayjs(date).format("M.D")}</span>
            </button>
          ))}
      </div>

      {/* 일기 추가 버튼 */}
      <button
        onClick={handleAddClick}
        className="mb-6 bg-[#e50914] px-6 py-3 rounded text-lg font-semibold hover:bg-[#b81d24] transition"
      >
        + 일기 추가
      </button>

      {/* 일기 작성/수정 폼 */}
      {(isAdding || openDate) && (
        <div className="bg-[#222] p-6 rounded-lg max-w-xl w-full shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isAdding ? "새 일기 작성" : `${dayjs(openDate).format("YYYY년 M월 D일")} 일기 수정`}
            </h2>
            <button
              onClick={() => {
                setIsAdding(false);
                setOpenDate(null);
              }}
              className="text-gray-400 hover:text-white text-2xl font-bold select-none"
              title="닫기"
            >
              &times;
            </button>
          </div>

          {isAdding && (
            <label className="block mb-4">
              날짜 선택:
              <input
                type="date"
                className="w-full mt-1 rounded bg-[#141414] p-2 text-white"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                max={dayjs().format("YYYY-MM-DD")}
              />
            </label>
          )}

          <label className="block mb-4">
            일기 내용:
            <textarea
              rows={10}
              className="w-full mt-1 rounded bg-[#141414] p-3 text-white resize-none"
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              placeholder="오늘 하루를 기록해보세요..."
            />
          </label>

          <div className="flex space-x-4">
            <button
              onClick={saveDiary}
              className="flex-1 bg-[#e50914] py-3 rounded hover:bg-[#b81d24] transition"
            >
              저장
            </button>
            {!isAdding && (
              <button
                onClick={() => deleteDiary(openDate)}
                className="flex-1 bg-[#ef4444] py-3 rounded hover:bg-[#dc2626] transition"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiaryPage;
