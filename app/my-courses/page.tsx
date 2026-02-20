"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { getPurchasedCourses } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import type { Course } from "@/lib/types";

export default function MyCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push("/login");
      return;
    }
    void loadData(token);
  }, [router]);

  async function loadData(token: string) {
    setLoading(true);
    try {
      const purchased = await getPurchasedCourses(token);
      setCourses(purchased);
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load your courses");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <AppNav />

      <section className="card intro-card dashboard-head">
        <div>
          <h1 className="title">My Courses</h1>
          <p className="muted">Your purchased learning library.</p>
        </div>
        <div className="stat-chip">
          <span>{courses.length}</span>
          <p>Total</p>
        </div>
      </section>
      {status && <p className="status page-status">{status}</p>}

      <section className="card">
        {loading ? (
          <p className="muted">Loading your courses...</p>
        ) : courses.length === 0 ? (
          <p className="muted">
            No purchases yet. Go to <Link href="/courses">Courses</Link> to buy one.
          </p>
        ) : (
          <div className="course-list">
            {courses.map((course) => (
              <article className="course-item" key={course._id}>
                <img src={course.imageUrl} alt={course.title} draggable={false} />
                <div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <p className="price">INR {course.price}</p>
                </div>
                <div className="actions">
                  <Link className="btn-primary" href={`/watch/${course._id}`}>
                    Watch now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
