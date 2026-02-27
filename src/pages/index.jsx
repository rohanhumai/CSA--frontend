import Link from "next/link";
import AppLayout from "../components/AppLayout";

export default function HomePage() {
  return (
    <AppLayout variant="marketing">
      <section className="grid gap-5 rounded-2xl border border-slate-200/70 bg-white/80 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Smart Preparation Platform</p>
          <h2 className="mt-2 font-['Sora'] text-3xl font-semibold text-slate-900 md:text-4xl">
            Build your exam momentum with structured PYQ courses
          </h2>
          <p className="mt-3 max-w-xl text-slate-600">
            Buy once, unlock curated question sets and PDF material instantly, and continue learning from a clean
            student dashboard.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/all-courses"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Explore Courses
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Why Students Use It</p>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            <li className="rounded-lg bg-white px-3 py-2">Topic-based PYQ bundles with clear categorization.</li>
            <li className="rounded-lg bg-white px-3 py-2">Secure Razorpay purchase flow before unlock.</li>
            <li className="rounded-lg bg-white px-3 py-2">Dedicated purchased-courses section for revisions.</li>
          </ul>
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/all-courses" className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5">
          <h3 className="font-['Sora'] text-lg font-semibold text-slate-900">All Courses</h3>
          <p className="mt-1 text-sm text-slate-600">Browse published tracks and purchase instantly.</p>
        </Link>
        <Link href="/my-courses" className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5">
          <h3 className="font-['Sora'] text-lg font-semibold text-slate-900">My Courses</h3>
          <p className="mt-1 text-sm text-slate-600">Open only your purchased content and PDFs.</p>
        </Link>
        <Link href="/admin" className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5">
          <h3 className="font-['Sora'] text-lg font-semibold text-slate-900">Admin Panel</h3>
          <p className="mt-1 text-sm text-slate-600">Create courses, add PYQs, and upload PDFs.</p>
        </Link>
      </section>
    </AppLayout>
  );
}
