import Link from "next/link";
import AppLayout from "../components/AppLayout";

export default function HomePage() {
  return (
    <AppLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-['Sora'] text-2xl font-semibold text-slate-900">Master exam prep with curated PYQ courses</h2>
        <p className="mt-2 text-slate-600">Choose what you want to do next.</p>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link href="/all-courses" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-500">
          <h3 className="font-['Sora'] text-xl font-semibold text-slate-900">All Courses</h3>
          <p className="mt-2 text-sm text-slate-600">Browse and enroll into every published course.</p>
        </Link>
        <Link href="/my-courses" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-500">
          <h3 className="font-['Sora'] text-xl font-semibold text-slate-900">My Courses</h3>
          <p className="mt-2 text-sm text-slate-600">View your enrolled courses in one place.</p>
        </Link>
        <Link href="/login" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-500">
          <h3 className="font-['Sora'] text-xl font-semibold text-slate-900">Login</h3>
          <p className="mt-2 text-sm text-slate-600">Sign in to manage your enrolled courses.</p>
        </Link>
        <Link href="/signup" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-500">
          <h3 className="font-['Sora'] text-xl font-semibold text-slate-900">Signup</h3>
          <p className="mt-2 text-sm text-slate-600">Create a new account.</p>
        </Link>
      </section>
    </AppLayout>
  );
}
