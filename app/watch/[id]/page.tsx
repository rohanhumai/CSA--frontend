"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { AppNav } from "@/components/app-nav";
import { getCourses, getPurchasedCourses } from "@/lib/api";
import { getStoredEmail, getStoredToken } from "@/lib/auth";
import type { Course } from "@/lib/types";

export default function WatchPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [status, setStatus] = useState("Verifying access...");
  const [blocked, setBlocked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wmX, setWmX] = useState(18);
  const [wmY, setWmY] = useState(18);

  const watermark = useMemo(() => {
    const email = getStoredEmail() || "viewer";
    return `${email} | ${new Date().toLocaleString()} | watch-only`;
  }, []);

  const verifyAndLoad = useCallback(async () => {
    const token = getStoredToken();
    const courseId = params.id;

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const [purchased, allCourses] = await Promise.all([
        getPurchasedCourses(token),
        getCourses(),
      ]);

      const purchasedIds = new Set(purchased.map((item) => item._id));
      if (!purchasedIds.has(courseId)) {
        setStatus("This course is not in your purchases.");
        router.push("/my-courses");
        return;
      }

      const selected = allCourses.find((item) => item._id === courseId) ?? null;
      if (!selected) {
        setStatus("Course not found.");
        return;
      }

      setCourse(selected);
      setStatus("Protected mode active.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not verify access");
    }
  }, [params.id, router]);

  useEffect(() => {
    void verifyAndLoad();
  }, [verifyAndLoad]);

  useEffect(() => {
    const body = document.body;
    body.classList.add("protected-mode");

    const onVisibility = () => setBlocked(document.visibilityState !== "visible");
    const onBlur = () => setBlocked(true);
    const onFocus = () => setBlocked(false);
    const onFullscreen = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active) {
        setBlocked(true);
        setStatus("Fullscreen exited. Content hidden until resumed.");
      } else {
        setBlocked(false);
        setStatus("Protected mode active.");
      }
    };

    const blocker = (event: Event) => event.preventDefault();
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const invalid =
        key === "printscreen" ||
        key === "f12" ||
        ((event.ctrlKey || event.metaKey) && ["s", "p", "u", "c", "x"].includes(key)) ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c", "s"].includes(key));
      if (invalid) {
        event.preventDefault();
        setStatus("Restricted action blocked.");
      }
    };

    const beforePrint = () => {
      setBlocked(true);
      setStatus("Printing is disabled in protected view.");
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("fullscreenchange", onFullscreen);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("contextmenu", blocker);
    document.addEventListener("dragstart", blocker);
    document.addEventListener("copy", blocker);
    document.addEventListener("cut", blocker);
    document.addEventListener("selectstart", blocker);
    window.addEventListener("beforeprint", beforePrint);

    const moveWatermark = window.setInterval(() => {
      setWmX(8 + Math.floor(Math.random() * 72));
      setWmY(8 + Math.floor(Math.random() * 72));
    }, 2200);

    return () => {
      body.classList.remove("protected-mode");
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("fullscreenchange", onFullscreen);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("contextmenu", blocker);
      document.removeEventListener("dragstart", blocker);
      document.removeEventListener("copy", blocker);
      document.removeEventListener("cut", blocker);
      document.removeEventListener("selectstart", blocker);
      window.removeEventListener("beforeprint", beforePrint);
      window.clearInterval(moveWatermark);
    };
  }, []);

  async function enterFullscreen() {
    try {
      await document.documentElement.requestFullscreen();
      setBlocked(false);
      setStatus("Protected mode active.");
    } catch {
      setStatus("Fullscreen permission denied.");
    }
  }

  return (
    <main className="shell">
      <AppNav />

      <section className="card intro-card">
        <h1 className="title">Protected watcher</h1>
        <p className="muted">
          View-only mode. Downloading, copying, printing, and common capture shortcuts are
          blocked at the app layer.
        </p>
        <div className="row">
          <button type="button" className="btn-primary" onClick={enterFullscreen}>
            {isFullscreen ? "Fullscreen enabled" : "Enter fullscreen"}
          </button>
          <Link className="btn-secondary" href="/my-courses">
            Back to my courses
          </Link>
        </div>
        {status && <p className="status">{status}</p>}
      </section>

      <section className="viewer-wrap">
        {!course ? (
          <div className="overlay-static">
            <p>Loading protected content...</p>
          </div>
        ) : (
          <div className={`viewer ${blocked ? "concealed" : ""}`}>
            <img src={course.imageUrl} alt={course.title} draggable={false} />
            <div className="watermark moving" style={{ left: `${wmX}%`, top: `${wmY}%` }}>
              {watermark}
            </div>
            {blocked && (
              <div className="overlay">
                <p>Viewer is hidden while focus or fullscreen requirements are not met.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
