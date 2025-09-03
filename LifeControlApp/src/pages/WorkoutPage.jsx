import { useState } from "react";

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const predefined = ["데드리프트", "벤치프레스", "스쿼트", "러닝", "직접 입력"];

  const handleAdd = () => {
    const activity = input === "직접 입력" ? customInput : input;
    if (!activity || !date) return;

    const newRecord = { date, activity };

    if (editIndex !== null) {
      const newList = [...workouts];
      newList[editIndex] = newRecord;
      setWorkouts(newList);
      setEditIndex(null);
    } else {
      setWorkouts([...workouts, newRecord]);
    }

    setDate("");
    setInput("");
    setCustomInput("");
  };

  const handleEdit = (index) => {
    const w = workouts[index];
    setDate(w.date);
    setInput(predefined.includes(w.activity) ? w.activity : "직접 입력");
    setCustomInput(predefined.includes(w.activity) ? "" : w.activity);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const newList = workouts.filter((_, i) => i !== index);
    setWorkouts(newList);
    setEditIndex(null);
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      days.push(dateStr);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const summary = last7Days.reduce((acc, date) => {
    acc[date] = workouts.filter((w) => w.date === date).length;
    return acc;
  }, {});

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🏋️ 운동 기록</h1>

      {/* 입력 폼 */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <input
          type="date"
          className="p-2 rounded bg-gray-800 text-white border border-gray-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          className="p-2 rounded bg-gray-800 text-white border border-gray-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        >
          <option value="">운동 선택</option>
          {predefined.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>

        {input === "직접 입력" && (
          <input
            type="text"
            className="p-2 rounded bg-gray-800 text-white border border-gray-500"
            placeholder="운동 이름 입력"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
        )}

        <button
          onClick={handleAdd}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
        >
          {editIndex !== null ? "수정" : "추가"}
        </button>
      </div>

      {/* 기록된 운동 */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">📒 기록된 운동</h2>
        {workouts.length === 0 ? (
          <p className="text-gray-400">아직 운동 기록이 없습니다.</p>
        ) : (
          <ul className="text-sm space-y-2">
            {workouts.map((w, i) => (
              <li key={i} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                <span>📅 {w.date} - {w.activity}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(i)}
                    className="text-blue-400 hover:underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="text-red-400 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 그래프 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">📊 일주일 운동 그래프</h2>
        <div className="bg-gray-800 p-4 rounded shadow">
          {last7Days.map((d) => (
            <div key={d} className="flex items-center mb-3 text-sm">
              <div className="w-24 text-gray-300">{d}</div>
              <div className="flex-1 bg-gray-600 h-5 rounded overflow-hidden">
                <div
                  className="bg-red-500 h-5 transition-all duration-300"
                  style={{ width: `${summary[d] * 25}px` }}
                ></div>
              </div>
              <div className="w-12 text-right ml-2 text-white">{summary[d]}회</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
