import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

const categories = {
  공부: "#3b82f6",
  운동: "#ef4444",
  여가: "#f59e0b",
  직접입력: null,
};

function CategoryDropdown({ value, onChange, customColor, setCustomColor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (cat) => {
    onChange(cat);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full bg-[#222] text-white rounded p-2"
      >
        <div className="flex items-center space-x-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: value === "직접입력" ? customColor || "#10b981" : categories[value] }}
          />
          <span>{value}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded bg-[#222] shadow-lg">
          {Object.keys(categories).map((cat) => (
            <li
              key={cat}
              onClick={() => handleSelect(cat)}
              className="cursor-pointer flex items-center space-x-2 px-3 py-2 hover:bg-[#333]"
            >
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: cat === "직접입력" ? customColor || "#10b981" : categories[cat] }}
              />
              <span>{cat}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendarEvents");
    return saved ? JSON.parse(saved) : {};
  });

  const [form, setForm] = useState({
    id: null,
    date: selectedDate.format("YYYY-MM-DD"),
    category: "공부",
    customCategoryName: "",
    customColor: "#10b981",
    title: "",
    importance: "중",
    summary: "",
    time: "",
  });

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const startDay = currentMonth.startOf("month").day();
  const daysInMonth = currentMonth.daysInMonth();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(currentMonth.date(d));

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const dayEvents = events[form.date] || [];

  const getCategoryColor = (ev) => {
    if (categories[ev.category]) return categories[ev.category];
    if (ev.category === "직접입력") return ev.customColor || "#10b981";
    return "#9ca3af";
  };

  const saveEvent = () => {
    if (!form.title.trim()) return alert("일정 제목을 입력하세요");

    setEvents((prev) => {
      const dayEvts = prev[form.date] ? [...prev[form.date]] : [];
      if (form.id !== null) {
        const idx = dayEvts.findIndex((e) => e.id === form.id);
        if (idx >= 0) dayEvts[idx] = { ...form };
      } else {
        dayEvts.push({ ...form, id: Date.now() });
      }
      return { ...prev, [form.date]: dayEvts };
    });

    setForm({
      id: null,
      date: form.date,
      category: "공부",
      customCategoryName: "",
      customColor: "#10b981",
      title: "",
      importance: "중",
      summary: "",
      time: "",
    });
  };

  const deleteEvent = (id) => {
    setEvents((prev) => {
      const dayEvts = prev[form.date] ? [...prev[form.date]] : [];
      const filtered = dayEvts.filter((e) => e.id !== id);
      return { ...prev, [form.date]: filtered };
    });
    if (form.id === id) {
      setForm({
        id: null,
        date: form.date,
        category: "공부",
        customCategoryName: "",
        customColor: "#10b981",
        title: "",
        importance: "중",
        summary: "",
        time: "",
      });
    }
  };

  const editEvent = (event) => {
    setForm({ ...event });
  };

  return (
    <div className="flex min-h-screen bg-[#141414] text-white p-4 pt-0">
      <div className="w-3/5 pr-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="px-3 py-1 bg-[#222] rounded hover:bg-[#333]">
            이전
          </button>
          <h2 className="text-xl font-semibold">{currentMonth.format("YYYY년 M월")}</h2>
          <button onClick={nextMonth} className="px-3 py-1 bg-[#222] rounded hover:bg-[#333]">
            다음
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d} className="font-semibold py-1 border-b border-gray-700">
              {d}
            </div>
          ))}

          {calendarDays.map((day, idx) =>
            day ? (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDate(day);
                  setForm((f) => ({
                    ...f,
                    date: day.format("YYYY-MM-DD"),
                    id: null,
                    title: "",
                    summary: "",
                    time: "",
                    importance: "중",
                    category: "공부",
                    customCategoryName: "",
                    customColor: "#10b981",
                  }));
                }}
                className={`relative rounded p-2 hover:bg-[#333] focus:outline-none ${
                  day.isSame(selectedDate, "day") ? "bg-[#3b82f6]" : "bg-[#222]"
                }`}
              >
                <div>{day.date()}</div>
                <div className="absolute bottom-1 left-1 flex space-x-1">
                  {(events[day.format("YYYY-MM-DD")] || []).map((evt) => (
                    <span
                      key={evt.id}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(evt) }}
                    />
                  ))}
                </div>
              </button>
            ) : (
              <div key={idx} />
            )
          )}
        </div>
      </div>

      <div className="w-2/5 bg-[#1f1f1f] p-6 rounded shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{form.id ? "일정 수정" : "일정 추가"}</h3>

        <label className="block mb-2">
          날짜:
          <input
            type="date"
            className="w-full mt-1 rounded bg-[#222] p-2 text-white"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, id: null }))}
          />
        </label>

        <label className="block mb-2">
          카테고리:
          <CategoryDropdown
            value={form.category}
            onChange={(cat) => setForm((f) => ({ ...f, category: cat }))}
            customColor={form.customColor}
            setCustomColor={(color) => setForm((f) => ({ ...f, customColor: color }))}
          />
        </label>

        {form.category === "직접입력" && (
          <>
            <label className="block mb-2">
              카테고리 이름:
              <input
                type="text"
                className="w-full mt-1 rounded bg-[#222] p-2 text-white"
                value={form.customCategoryName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customCategoryName: e.target.value }))
                }
              />
            </label>
            <label className="block mb-4">
              색상 선택:
              <input
                type="color"
                className="w-full h-8 mt-1 p-0 border-0 cursor-pointer"
                value={form.customColor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customColor: e.target.value }))
                }
              />
            </label>
          </>
        )}

        <label className="block mb-2">
          제목:
          <input
            type="text"
            className="w-full mt-1 rounded bg-[#222] p-2 text-white"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </label>

        <label className="block mb-2">
          시간:
          <input
            type="time"
            className="w-full mt-1 rounded bg-[#222] p-2 text-white"
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          />
        </label>

        <label className="block mb-2">
          중요도:
          <select
            className="w-full mt-1 rounded bg-[#222] p-2 text-white"
            value={form.importance}
            onChange={(e) => setForm((f) => ({ ...f, importance: e.target.value }))}
          >
            <option value="상">상</option>
            <option value="중">중</option>
            <option value="하">하</option>
          </select>
        </label>

        <label className="block mb-4">
          요약:
          <textarea
            className="w-full mt-1 rounded bg-[#222] p-2 text-white resize-none"
            rows={3}
            value={form.summary}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          />
        </label>

        <div className="flex space-x-2">
          <button
            onClick={saveEvent}
            className="flex-1 bg-[#e50914] hover:bg-[#b20710] rounded py-2"
          >
            저장
          </button>
          {form.id && (
            <button
              onClick={() => deleteEvent(form.id)}
              className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] rounded py-2"
            >
              삭제
            </button>
          )}
        </div>

        <div className="mt-6 max-h-48 overflow-auto border-t border-gray-600 pt-4">
          {(dayEvents.length === 0 && <p className="text-gray-400">일정이 없습니다.</p>) ||
            dayEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#333]"
                onClick={() => editEvent(evt)}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getCategoryColor(evt) }}
                  />
                  <div>
                    <div className="font-semibold">{evt.title}</div>
                    <div className="text-xs text-gray-400">
                      {evt.time} - {evt.summary}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{evt.importance}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
