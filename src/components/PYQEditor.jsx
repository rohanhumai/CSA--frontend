const emptyPyq = { question: "", answer: "", year: "", exam: "" };

function PYQEditor({ pyqs, setPyqs }) {
  const updateItem = (index, key, value) => {
    const next = [...pyqs];
    next[index] = { ...next[index], [key]: value };
    setPyqs(next);
  };

  const addPyq = () => setPyqs([...(pyqs || []), { ...emptyPyq }]);

  const removePyq = (index) => setPyqs(pyqs.filter((_, idx) => idx !== index));

  return (
    <section className="border-t border-slate-200 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-['Sora'] text-lg font-semibold text-slate-900">PYQs</h3>
        <button
          type="button"
          onClick={addPyq}
          className="rounded-lg border border-teal-600 bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          + Add PYQ
        </button>
      </div>

      {(pyqs || []).map((item, index) => (
        <div key={`${index}-${item.question}`} className="mb-3 rounded-xl border border-slate-200 p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
              placeholder="Exam name"
              value={item.exam}
              onChange={(e) => updateItem(index, "exam", e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
              type="number"
              placeholder="Year"
              value={item.year}
              onChange={(e) => updateItem(index, "year", e.target.value)}
            />
          </div>

          <textarea
            className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
            placeholder="Question"
            rows={2}
            value={item.question}
            onChange={(e) => updateItem(index, "question", e.target.value)}
          />
          <textarea
            className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
            placeholder="Answer"
            rows={3}
            value={item.answer}
            onChange={(e) => updateItem(index, "answer", e.target.value)}
          />

          <button
            type="button"
            className="mt-3 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            onClick={() => removePyq(index)}
          >
            Remove
          </button>
        </div>
      ))}
    </section>
  );
}

export default PYQEditor;
