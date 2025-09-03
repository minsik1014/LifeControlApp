import { useState } from "react";

export default function ReviewPage({ type }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const emptyForm = {
    title: "",
    image: "",
    rating: 0,
    summary: "",
    fullReview: "",
  };

  const [form, setForm] = useState(emptyForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (index) => {
    setForm((prev) => ({ ...prev, rating: index + 1 }));
  };

  // 리뷰 추가 or 수정 제출
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingIndex !== null) {
      // 수정
      const newReviews = [...reviews];
      newReviews[editingIndex] = form;
      setReviews(newReviews.sort((a, b) => b.rating - a.rating));
      setEditingIndex(null);
    } else {
      // 추가
      setReviews((prev) =>
        [...prev, form].sort((a, b) => b.rating - a.rating)
      );
    }

    setForm(emptyForm);
    setShowForm(false);
  };

  // 리뷰 삭제
  const handleDelete = (index) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const newReviews = [...reviews];
      newReviews.splice(index, 1);
      setReviews(newReviews);
      setSelectedReview(null);
      if (editingIndex === index) {
        setEditingIndex(null);
        setShowForm(false);
        setForm(emptyForm);
      }
    }
  };

  // 리뷰 수정 시작
  const handleEdit = (index) => {
    setEditingIndex(index);
    setForm(reviews[index]);
    setShowForm(true);
  };

  const renderStars = (rating, onClick) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            onClick={() => onClick && onClick(i)}
            className={`w-6 h-6 cursor-pointer ${
              i < rating ? "text-yellow-400" : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.975z" />
          </svg>
        ))}
      </div>
    );
  };

  if (selectedReview !== null) {
    return (
      <div className="px-6 py-10 bg-black text-white min-h-screen">
        <button
          className="mb-4 text-sm hover:underline"
          onClick={() => setSelectedReview(null)}
        >
          ← 뒤로가기
        </button>
        <div className="max-w-3xl mx-auto mt-6">
          <h1 className="text-4xl font-bold mb-4">{selectedReview.title}</h1>
          <div className="flex items-start gap-6 mb-8">
            {selectedReview.image && (
              <img
                src={selectedReview.image}
                alt="poster"
                className="w-32 h-48 object-cover rounded shadow"
              />
            )}
            <div>{renderStars(selectedReview.rating)}</div>
          </div>
          <article className="prose prose-invert max-w-none text-lg leading-relaxed">
            {selectedReview.fullReview}
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">
        {type === "book" ? "📚 책 리뷰" : "🎬 영화 리뷰"}
      </h2>

      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingIndex(null);
          setForm(emptyForm);
        }}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 mb-6"
      >
        {showForm ? "리뷰 닫기" : "+ 리뷰 추가"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded mb-10 space-y-4"
        >
          <div>
            <label className="block mb-1 text-sm">
              {type === "book" ? "책 이름" : "영화 이름"}
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">사진 URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">별점</label>
            {renderStars(form.rating, handleRating)}
          </div>

          <div>
            <label className="block mb-1 text-sm">한줄평</label>
            <input
              type="text"
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">전체 감상문</label>
            <textarea
              name="fullReview"
              value={form.fullReview}
              onChange={handleChange}
              className="w-full p-2 h-40 rounded bg-gray-700 text-white"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
          >
            {editingIndex !== null ? "수정 완료" : "등록"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700 relative"
          >
            <div onClick={() => setSelectedReview(review)}>
              {review.image && (
                <img
                  src={review.image}
                  alt="poster"
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-xl font-semibold mb-1">{review.title}</h3>
              {renderStars(review.rating)}
              <p className="mt-2 text-sm text-gray-300">{review.summary}</p>
            </div>
            {/* 수정/삭제 버튼 */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEdit(idx)}
                className="bg-yellow-500 px-2 py-1 rounded text-black hover:bg-yellow-400"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(idx)}
                className="bg-red-600 px-2 py-1 rounded hover:bg-red-500"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
