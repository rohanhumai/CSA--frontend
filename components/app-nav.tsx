"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth, getStoredEmail } from "@/lib/auth";

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <header className="top-nav">
      <Link href="/courses" className="brand">
        <span className="brand-mark">C</span>
        CourseVault
      </Link>

      <nav>
        <Link className={pathname === "/courses" ? "active" : ""} href="/courses">
          Courses
        </Link>
        <Link className={pathname === "/my-courses" ? "active" : ""} href="/my-courses">
          My Courses
        </Link>
      </nav>

      <div className="nav-right">
        <span suppressHydrationWarning>{getStoredEmail() || "User"}</span>
        <button type="button" className="text-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
