import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import AppLayout from "../components/AppLayout";
import CourseCard from "../components/CourseCard";
import { session } from "../lib/session";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [openingPdfId, setOpeningPdfId] = useState("");

  useEffect(() => {
    const userToken = session.getUserToken();
    setToken(userToken);
    const loggedIn = Boolean(userToken);
    setIsLoggedIn(loggedIn);

    const loadMyCourses = async () => {
      if (!loggedIn) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getMyCourses(userToken);
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMyCourses();
  }, []);

  const handleOpenPdf = async (courseId, pdfId) => {
    try {
      setOpeningPdfId(pdfId);
      setError("");
      await api.openPdfInNewTab(courseId, pdfId, token);
    } catch (err) {
      setError(err.message);
    } finally {
      setOpeningPdfId("");
    }
  };
  const totalPdfs = useMemo(
    () => courses.reduce((sum, course) => sum + Number(course.pdfs?.length || 0), 0),
    [courses]
  );

  return (
    <AppLayout variant="student">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-['Sora'] text-2xl font-semibold text-slate-900">My Learning Library</h2>
        <p className="mt-2 text-slate-600">Access all purchased courses and revision PDFs from one dashboard.</p>

        {isLoggedIn ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Purchased Courses</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{courses.length}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Available PDFs</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{totalPdfs}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Learning Status</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{courses.length ? "Active" : "New"}</p>
            </article>
          </div>
        ) : null}
      </section>

      {!isLoggedIn ? (
        <p className="mt-4 text-slate-600">
          Please{" "}
          <Link href="/login" className="font-semibold text-teal-700">
            login
          </Link>{" "}
          to view your purchased courses.
        </p>
      ) : null}

      {isLoggedIn && loading ? <p className="mt-4 text-slate-500">Loading your courses...</p> : null}
      {isLoggedIn && !loading && error ? <p className="mt-4 text-rose-700">{error}</p> : null}

      {isLoggedIn && !loading && !error ? (
        courses.length === 0 ? (
          <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-slate-500">
            You have no purchased courses yet.{" "}
            <Link href="/all-courses" className="font-semibold text-teal-700">
              Browse all courses
            </Link>
            .
          </p>
        ) : (
          <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course}>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Course PDFs</p>
                  {Array.isArray(course.pdfs) && course.pdfs.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {course.pdfs.map((pdf) => (
                        <button
                          type="button"
                          key={pdf._id}
                          onClick={() => handleOpenPdf(course._id, pdf._id)}
                          disabled={openingPdfId === pdf._id}
                          className="block w-full rounded-md border border-teal-200 bg-white px-3 py-2 text-left text-sm font-semibold text-teal-700 hover:bg-teal-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                        >
                          {openingPdfId === pdf._id ? "Opening..." : `View PDF: ${pdf.title}`}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">No PDFs available in this course yet.</p>
                  )}
                </div>
              </CourseCard>
            ))}
          </section>
        )
      ) : null}
    </AppLayout>
  );
}

