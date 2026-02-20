import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import AppLayout from "../components/AppLayout";

const getUsers = () => {
  try {
    return JSON.parse(window.localStorage.getItem("users") || "[]");
  } catch {
    return [];
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const users = getUsers();
    const user = users.find(
      (item) => item.email.toLowerCase() === form.email.toLowerCase() && item.password === form.password
    );

    if (!user) {
      setMessage("Invalid email or password.");
      return;
    }

    window.localStorage.setItem("currentUser", JSON.stringify({ name: user.name, email: user.email }));
    setMessage("Login successful. Redirecting...");
    setTimeout(() => router.push("/all-courses"), 700);
  };

  return (
    <AppLayout>
      <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-['Sora'] text-2xl font-semibold text-slate-900">Login</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="w-full rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700">
            Login
          </button>
        </form>
        {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
        <p className="mt-3 text-sm text-slate-600">
          No account yet?{" "}
          <Link href="/signup" className="font-semibold text-teal-700">
            Signup
          </Link>
        </p>
      </section>
    </AppLayout>
  );
}
