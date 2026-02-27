import Link from "next/link";
import AppLayout from "../components/AppLayout";

export default function HomePage() {
  return (
    <AppLayout variant="marketing">
      <section className="grid gap-5 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg md:grid-cols-[1.3fr_1fr] md:p-9">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">India's Exam Learning Platform</p>
          <h2 className="mt-3 font-['Sora'] text-3xl font-semibold leading-tight md:text-5xl">
            Crack exams with structured courses, PYQs, and revision PDFs
          </h2>
          <p className="mt-4 max-w-xl text-sm text-blue-100 md:text-base">
            Premium preparation tracks with guided content flow. Enroll fast, learn systematically, and revise from
            your own dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/all-courses"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Start Learning
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-blue-200 bg-blue-500/30 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500/50"
            >
              Join Now
            </Link>
          </div>
        </div>

        <div className="grid gap-3 text-slate-900">
          <article className="rounded-2xl bg-white p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Active Learners</p>
            <p className="mt-1 text-2xl font-bold">10K+</p>
          </article>
          <article className="rounded-2xl bg-white p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Practice Questions</p>
            <p className="mt-1 text-2xl font-bold">50K+</p>
          </article>
          <article className="rounded-2xl bg-white p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Course Completion</p>
            <p className="mt-1 text-2xl font-bold">92%</p>
          </article>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Top Exam Categories</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["JEE", "NEET", "GATE", "UPSC", "SSC", "Banking", "Boards"].map((item) => (
            <span key={item} className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/all-courses"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
        >
          <h3 className="font-['Sora'] text-lg font-semibold text-slate-900">Explore Courses</h3>
          <p className="mt-1 text-sm text-slate-600">Choose exam-specific programs and purchase in one click.</p>
        </Link>
        <Link
          href="/my-courses"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
        >
          <h3 className="font-['Sora'] text-lg font-semibold text-slate-900">My Learning</h3>
          <p className="mt-1 text-sm text-slate-600">Track purchased content and open revision PDFs instantly.</p>
        </Link>
        <Link
          href="/admin"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
        >
          <h3 className="font-['Sora'] text-lg font-semibold text-slate-900">Admin Console</h3>
          <p className="mt-1 text-sm text-slate-600">Manage catalog, PYQs, and PDF resources professionally.</p>
        </Link>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Student Reviews</p>
          <p className="mt-2 text-sm text-slate-700">
            "Structured PYQ flow and clean dashboard made my revision easier in the last 30 days."
          </p>
          <p className="mt-2 text-xs font-semibold text-blue-700">Ananya, JEE Aspirant</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Platform Promise</p>
          <p className="mt-2 text-sm text-slate-700">
            Fast payments, course unlock only after verified purchase, and focused exam prep workflow.
          </p>
          <p className="mt-2 text-xs font-semibold text-blue-700">Built for outcomes</p>
        </article>
      </section>
    </AppLayout>
  );
}
