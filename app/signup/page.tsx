"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus("Creating account...");

    try {
      const message = await signup({ firstName, lastName, email, password });
      setStatus(message);
      router.push("/login");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="auth-layout">
        <aside className="card auth-showcase">
          <p className="eyebrow">Get started</p>
          <h2>Join a focused learning ecosystem</h2>
          <p>Create your profile and unlock premium courses with protected delivery.</p>
          <ul>
            <li>Instant account setup</li>
            <li>Track all purchases in one place</li>
            <li>Designed for serious students</li>
          </ul>
        </aside>

        <section className="card auth-card">
          <p className="eyebrow">Account</p>
          <h1 className="title">Create account</h1>
          <p className="muted">Use your account to purchase and watch protected content.</p>

          <form className="form" onSubmit={onSubmit}>
            <label>
              First Name
              <input
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </label>
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
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {status && <p className="status">{status}</p>}

          <p className="muted">
            Already registered? <Link href="/login">Sign in</Link>
          </p>
        </section>
      </section>
    </main>
  );
}
