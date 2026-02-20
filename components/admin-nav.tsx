"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminAuth, getStoredAdminEmail } from "@/lib/auth";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearAdminAuth();
    router.push("/admin/login");
  }

  return (
    <header className="top-nav">
      <Link href="/admin/courses" className="brand">
        <span className="brand-mark">A</span>
        CourseVault Admin
      </Link>

      <nav>
        <Link className={pathname === "/admin/courses" ? "active" : ""} href="/admin/courses">
          Manage Courses
        </Link>
      </nav>

      <div className="nav-right">
        <span suppressHydrationWarning>{getStoredAdminEmail() || "Admin"}</span>
        <button type="button" className="text-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
