import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import AppLayout from "../components/AppLayout";
import PYQEditor from "../components/PYQEditor";

const initialForm = {
  title: "",
  description: "",
  category: "",
  price: "",
  thumbnail: "",
  published: true,
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [courses, setCourses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [pyqs, setPyqs] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCourse = useMemo(
    () => courses.find((item) => item._id === selectedId),
    [courses, selectedId]
  );

  const fetchAdminCourses = async () => {
    try {
      const data = await api.getCourses(true);
      setCourses(data);
    } catch (err) {
      if ((err.message || "").toLowerCase().includes("failed")) {
        const rawToken = window.localStorage.getItem("adminToken");
        if (rawToken) {
          window.localStorage.removeItem("adminToken");
          setToken("");
          setMessage("Session expired. Please login again.");
          return;
        }
      }
      throw err;
    }
  };

  useEffect(() => {
    const storedToken = window.localStorage.getItem("adminToken") || "";
    setToken(storedToken);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !token) return;
    fetchAdminCourses().catch((err) => setMessage(err.message));
  }, [hydrated, token]);

  useEffect(() => {
    if (!selectedCourse) return;
    setForm({
      title: selectedCourse.title || "",
      description: selectedCourse.description || "",
      category: selectedCourse.category || "",
      price: selectedCourse.price || "",
      thumbnail: selectedCourse.thumbnail || "",
      published: selectedCourse.published !== false,
    });
    setPyqs(selectedCourse.pyqs || []);
    setPdfs(selectedCourse.pdfs || []);
  }, [selectedCourse]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = await api.adminLogin(login.email, login.password);
      setToken(data.token);
      window.localStorage.setItem("adminToken", data.token);
      setMessage("Admin login successful.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      price: Number(form.price || 0),
      pyqs,
      pdfs,
    };

    try {
      if (selectedId) {
        await api.updateCourse(selectedId, payload, token);
        setMessage("Course updated.");
      } else {
        const created = await api.createCourse(payload, token);
        setSelectedId(created._id);
        setPdfs(created.pdfs || []);
        setMessage("Course created.");
      }

      await fetchAdminCourses();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const resetForm = () => {
    setSelectedId("");
    setForm(initialForm);
    setPyqs([]);
    setPdfs([]);
    setPdfTitle("");
    setPdfFile(null);
  };

  const logout = () => {
    window.localStorage.removeItem("adminToken");
    setToken("");
    setCourses([]);
    setSelectedId("");
    setForm(initialForm);
    setPyqs([]);
    setPdfs([]);
    setPdfTitle("");
    setPdfFile(null);
    setMessage("Logged out.");
  };

  const handleUploadPdf = async () => {
    setMessage("");
    if (!selectedId) {
      setMessage("Please create/select a course first.");
      return;
    }
    if (!pdfFile) {
      setMessage("Please choose a PDF file.");
      return;
    }

    try {
      setUploadingPdf(true);
      const updated = await api.uploadCoursePdf(selectedId, pdfFile, pdfTitle, token);
      setPdfs(updated.pdfs || []);
      await fetchAdminCourses();
      setPdfTitle("");
      setPdfFile(null);
      setMessage("PDF uploaded.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleDeletePdf = async (pdfId) => {
    setMessage("");
    try {
      const updated = await api.deleteCoursePdf(selectedId, pdfId, token);
      setPdfs(updated.pdfs || []);
      await fetchAdminCourses();
      setMessage("PDF removed.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!hydrated) {
    return (
      <AppLayout>
        <p className="text-slate-500">Loading admin panel...</p>
      </AppLayout>
    );
  }

  if (!token) {
    return (
      <AppLayout>
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-['Sora'] text-2xl font-semibold text-slate-900">Admin Login</h2>
          <form className="mt-4 space-y-3" onSubmit={handleLogin}>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
              placeholder="Admin email"
              type="email"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
              placeholder="Password"
              type="password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Login
            </button>
            {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          </form>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="max-h-[72vh] overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-['Sora'] text-xl font-semibold text-slate-900">Courses</h2>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              + New
            </button>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>

          <div className="space-y-2">
            {courses.map((course) => (
              <button
                key={course._id}
                className={[
                  "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left",
                  course._id === selectedId
                    ? "border-teal-600 bg-teal-50 text-teal-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
                onClick={() => setSelectedId(course._id)}
              >
                <span className="pr-2 text-sm font-semibold">{course.title}</span>
                <small className="text-xs">{course.pyqs?.length || 0} PYQs</small>
              </button>
            ))}
          </div>
        </aside>

        <form className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" onSubmit={handleSave}>
          <h2 className="font-['Sora'] text-2xl font-semibold text-slate-900">
            {selectedId ? "Edit Course" : "Create Course"}
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
              placeholder="Course title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>

          <textarea
            className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
              placeholder="Thumbnail URL"
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            />
          </div>

          <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published
          </label>

          <div className="mt-4">
            <PYQEditor pyqs={pyqs} setPyqs={setPyqs} />
          </div>

          <section className="mt-4 rounded-xl border border-slate-200 p-3">
            <h3 className="font-['Sora'] text-lg font-semibold text-slate-900">Course PDFs</h3>
            <p className="mt-1 text-xs text-slate-500">Upload only PDF files (max 10MB each).</p>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
                placeholder="PDF title (optional)"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
              />
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              />
              <button
                type="button"
                onClick={handleUploadPdf}
                disabled={uploadingPdf}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {uploadingPdf ? "Uploading..." : "Upload PDF"}
              </button>
            </div>

            {pdfs.length > 0 ? (
              <div className="mt-3 space-y-2">
                {pdfs.map((pdf) => (
                  <div
                    key={pdf._id}
                    className="flex flex-col gap-2 rounded-lg border border-slate-200 p-2 md:flex-row md:items-center md:justify-between"
                  >
                    <a
                      href={api.toAbsoluteFileUrl(pdf.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-teal-700 hover:underline"
                    >
                      {pdf.title}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeletePdf(pdf._id)}
                      className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No PDFs uploaded yet.</p>
            )}
          </section>

          <button
            type="submit"
            className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            {selectedId ? "Update Course" : "Create Course"}
          </button>
          {message ? <p className="mt-2 text-sm text-slate-600">{message}</p> : null}
        </form>
      </section>
    </AppLayout>
  );
}
