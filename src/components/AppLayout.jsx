import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { session } from "../lib/session";

const navItemClass = (active) =>
  [
    "rounded-full px-4 py-2 text-sm font-semibold transition",
    active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
  ].join(" ");

const variants = {
  marketing: {
    container: "mx-auto w-[94vw] max-w-6xl py-8 md:py-10",
    shell: "rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-5 shadow-sm md:p-8",
    title: "CourseSphere",
    subtitle: "MERN + Solana",
    nav: [
      { href: "/", label: "Home" },
      { href: "/all-courses", label: "Explore" },
      { href: "/admin", label: "Admin" },
    ],
    cta: "auth",
  },
  auth: {
    container: "mx-auto flex min-h-screen w-[94vw] max-w-6xl items-center py-10",
    shell: "w-full rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur md:p-8",
    title: "Account Access",
    subtitle: "Secure login and onboarding",
    nav: [{ href: "/", label: "Back Home" }],
    cta: "none",
  },
  student: {
    container: "mx-auto w-[94vw] max-w-6xl py-8 md:py-10",
    shell: "rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm md:p-8",
    title: "CourseSphere Student",
    subtitle: "Learn from purchased course libraries",
    nav: [
      { href: "/all-courses", label: "All Courses" },
      { href: "/my-courses", label: "My Courses" },
    ],
    cta: "auth",
  },
  admin: {
    container: "mx-auto w-[94vw] max-w-7xl py-8 md:py-10",
    shell: "rounded-3xl border border-amber-200/70 bg-gradient-to-b from-white to-amber-50/40 p-5 shadow-sm md:p-8",
    title: "CourseSphere Admin",
    subtitle: "Manage courses, PYQs, and PDFs",
    nav: [{ href: "/admin", label: "Overview" }],
    cta: "none",
  },
};

export default function AppLayout({ children, variant = "student" }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const config = variants[variant] || variants.student;

  useEffect(() => {
    const userToken = session.getUserToken();
    setToken(userToken);
    setHydrated(true);
  }, [router.pathname]);

  const isLoggedIn = Boolean(token);
  const authAction = useMemo(() => {
    if (!hydrated || config.cta !== "auth") return null;
    if (isLoggedIn) {
      return (
        <button
          type="button"
          onClick={() => {
            session.clearUserAuth();
            setToken("");
            router.push("/login");
          }}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Logout
        </button>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Sign up
        </Link>
      </div>
    );
  }, [config.cta, hydrated, isLoggedIn, router]);

  return (
    <div className={config.container}>
      <div className={config.shell}>
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-['Manrope'] text-xs uppercase tracking-[0.16em] text-slate-500">{config.subtitle}</p>
            <div className="flex items-center gap-2">
              <h1 className="font-['Sora'] text-3xl font-bold text-slate-900">{config.title}</h1>
              {variant === "marketing" ? (
                <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-teal-700">
                  Live
                </span>
              ) : null}
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {config.nav.map((item) => (
              <Link key={item.href} href={item.href} className={navItemClass(router.pathname === item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          {authAction ? <div>{authAction}</div> : null}
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
