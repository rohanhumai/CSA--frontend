import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../api";
import AppLayout from "../components/AppLayout";
import CourseCard from "../components/CourseCard";

const getStoredCourseIds = () => {
  try {
    return JSON.parse(window.localStorage.getItem("myCourseIds") || "[]");
  } catch {
    return [];
  }
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const currentUser = window.localStorage.getItem("currentUser");
    const loggedIn = Boolean(currentUser);
    setIsLoggedIn(loggedIn);

    const loadMyCourses = async () => {
      if (!loggedIn) {
        setLoading(false);
        return;
      }

      try {
        const ids = getStoredCourseIds();
        const data = await api.getCourses();
        setCourses(data.filter((course) => ids.includes(course._id)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMyCourses();
  }, []);

  return (
    <AppLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-['Sora'] text-2xl font-semibold text-slate-900">My Courses</h2>
        <p className="mt-2 text-slate-600">Your enrolled courses are shown here.</p>
      </section>

      {!isLoggedIn ? (
        <p className="mt-4 text-slate-600">
          Please <Link href="/login" className="font-semibold text-teal-700">login</Link> to view your courses.
        </p>
      ) : null}

      {isLoggedIn && loading ? <p className="mt-4 text-slate-500">Loading your courses...</p> : null}
      {isLoggedIn && !loading && error ? <p className="mt-4 text-rose-700">{error}</p> : null}

      {isLoggedIn && !loading && !error ? (
        courses.length === 0 ? (
          <p className="mt-4 text-slate-500">
            You have no courses yet.{" "}
            <Link href="/all-courses" className="font-semibold text-teal-700">
              Browse all courses
            </Link>
            .
          </p>
        ) : (
          <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </section>
        )
      ) : null}
    </AppLayout>
  );
}
