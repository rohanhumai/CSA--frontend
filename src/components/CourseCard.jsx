function CourseCard({ course, actionLabel = "", onAction, actionDisabled = false }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">{course.category}</p>
        <p className="text-sm font-bold text-slate-800">Rs {Number(course.price).toLocaleString()}</p>
      </div>

      <h3 className="mt-3 font-['Sora'] text-xl font-semibold text-slate-900">{course.title}</h3>
      <p className="mt-2 min-h-12 text-sm text-slate-600">{course.description}</p>

      <div className="mt-3 flex items-baseline gap-2">
        <strong className="text-lg text-slate-900">{course.pyqs?.length || 0}</strong>
        <span className="text-sm text-slate-600">PYQs included</span>
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-700">
        {(course.pyqs || []).slice(0, 2).map((item) => (
          <div key={item._id || `${item.exam}-${item.year}-${item.question}`}>
            <p className="text-xs text-slate-500">
              {item.exam} - {item.year}
            </p>
            <p>{item.question}</p>
          </div>
        ))}
      </div>

      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          disabled={actionDisabled}
          className="mt-4 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {actionLabel}
        </button>
      ) : null}
    </article>
  );
}

export default CourseCard;
