import Link from "next/link";
import { useRouter } from "next/router";

const navItemClass = (active) =>
  [
    "rounded-full border px-4 py-2 text-sm font-semibold transition",
    active ? "border-teal-600 bg-teal-50 text-teal-700" : "border-transparent text-slate-500 hover:border-slate-300",
  ].join(" ");

export default function AppLayout({ children }) {
  const router = useRouter();

  return (
    <div className="mx-auto w-[94vw] max-w-6xl py-8">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-['Manrope'] text-xs uppercase tracking-[0.12em] text-slate-500">MERN + Solana</p>
          <h1 className="font-['Sora'] text-3xl font-bold text-slate-900">Course Selling App</h1>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <Link href="/" className={navItemClass(router.pathname === "/")}>
            Home
          </Link>
          <Link href="/all-courses" className={navItemClass(router.pathname === "/all-courses")}>
            All Courses
          </Link>
          <Link href="/my-courses" className={navItemClass(router.pathname === "/my-courses")}>
            My Courses
          </Link>
          <Link href="/login" className={navItemClass(router.pathname === "/login")}>
            Login
          </Link>
          <Link href="/signup" className={navItemClass(router.pathname === "/signup")}>
            Sign Up
          </Link>
          <Link href="/admin" className={navItemClass(router.pathname === "/admin")}>
            Admin
          </Link>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
