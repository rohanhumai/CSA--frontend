"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Shield,
} from "lucide-react";

export default function Navbar() {
  const { user, signout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignout = () => {
    signout();
    // Client-side redirect handled in context usually,
    // but here we just reload or redirect:
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              Course<span className="gradient-text">Chain</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/courses" className="btn-ghost">
              Explore
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="btn-ghost flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="btn-ghost flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-dark-600">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleSignout}
                    className="btn-ghost flex items-center gap-2 text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link href="/login" className="btn-ghost">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary !py-2 !px-5 text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-dark-700/50 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/courses"
              className="block py-2 px-3 rounded-lg hover:bg-dark-800"
              onClick={() => setOpen(false)}
            >
              Explore Courses
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 px-3 rounded-lg hover:bg-dark-800"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignout();
                    setOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 rounded-lg text-red-400 hover:bg-dark-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 px-3 rounded-lg hover:bg-dark-800"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block py-2 px-3 rounded-lg bg-blue-600 text-center font-semibold"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
