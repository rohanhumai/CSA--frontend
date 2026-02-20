"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminSignin } from "@/lib/api";
import { storeAdminAuth } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus("Signing in...");

    try {
      const token = await adminSignin({ email, password });
      storeAdminAuth(token, email);
      setStatus("Signed in");
      router.push("/admin/courses");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Signin failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="auth-layout">
        <aside className="card auth-showcase">
          <p className="eyebrow">Admin access</p>
          <h2>Course management panel</h2>
          <p>Create and update course listings directly from your dashboard.</p>
        </aside>

        <section className="card auth-card">
          <p className="eyebrow">Admin</p>
          <h1 className="title">Login</h1>

          <form className="form" onSubmit={onSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button className="btn-primary" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {status && <p className="status">{status}</p>}
          <p className="muted">If you need access, ask the system owner to seed your account.</p>
        </section>
      </section>
    </main>
  );
}
