import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

export default function AllCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [myCourseIds, setMyCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const currentUser = window.localStorage.getItem("currentUser");
    setIsLoggedIn(Boolean(currentUser));
    setMyCourseIds(getStoredCourseIds());

    const loadCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleEnroll = (courseId) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const nextIds = Array.from(new Set([...myCourseIds, courseId]));
    setMyCourseIds(nextIds);
    window.localStorage.setItem("myCourseIds", JSON.stringify(nextIds));
  };

  return (
    <AppLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-['Sora'] text-2xl font-semibold text-slate-900">All Courses</h2>
        <p className="mt-2 text-slate-600">Browse every published course and enroll.</p>
      </section>

      {loading ? <p className="mt-4 text-slate-500">Loading courses...</p> : null}
      {!loading && error ? <p className="mt-4 text-rose-700">{error}</p> : null}

      {!loading && !error ? (
        courses.length === 0 ? (
          <p className="mt-4 text-slate-500">No published courses yet.</p>
        ) : (
          <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const enrolled = myCourseIds.includes(course._id);
              return (
                <CourseCard
                  key={course._id}
                  course={course}
                  actionLabel={enrolled ? "Enrolled" : "Enroll"}
                  actionDisabled={enrolled}
                  onAction={() => handleEnroll(course._id)}
                />
              );
            })}
          </section>
        )
      ) : null}
    </AppLayout>
  );
}
