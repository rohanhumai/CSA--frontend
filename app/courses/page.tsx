"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { getCourses, getPurchasedCourses, purchaseCourse } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import type { Course } from "@/lib/types";

export default function CoursesPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [owned, setOwned] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const ownedCount = useMemo(() => Object.keys(owned).length, [owned]);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    void loadData(storedToken);
  }, [router]);

  async function loadData(userToken: string) {
    setLoading(true);
    try {
      const [allCourses, purchased] = await Promise.all([
        getCourses(),
        getPurchasedCourses(userToken),
      ]);

      const ownedMap: Record<string, boolean> = {};
      for (const course of purchased) {
        ownedMap[course._id] = true;
      }

      setCourses(allCourses);
      setOwned(ownedMap);
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  async function buy(courseId: string) {
    if (!token) {
      setStatus("Please sign in first");
      return;
    }

    try {
      const message = await purchaseCourse(token, courseId);
      setStatus(message);
      await loadData(token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Purchase failed");
    }
  }

  return (
    <main className="shell">
      <AppNav />

      <section className="card intro-card dashboard-head">
        <div>
          <h1 className="title">Course Catalog</h1>
          <p className="muted">Choose from curated tracks and start learning instantly.</p>
        </div>
        <div className="stat-chip">
          <span>{ownedCount}</span>
          <p>Purchased</p>
        </div>
      </section>
      {status && <p className="status page-status">{status}</p>}

      <section className="card">
        {loading ? (
          <p className="muted">Loading courses...</p>
        ) : (
          <div className="course-list">
            {courses.map((course) => {
              const isOwned = Boolean(owned[course._id]);
              return (
                <article className="course-item" key={course._id}>
                  <img src={course.imageUrl} alt={course.title} draggable={false} />
                  <div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <p className="price">INR {course.price}</p>
                  </div>
                  <div className="actions">
                    {isOwned ? (
                      <Link className="btn-primary" href={`/watch/${course._id}`}>
                        Watch
                      </Link>
                    ) : (
                      <button className="btn-primary" type="button" onClick={() => buy(course._id)}>
                        Buy course
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
