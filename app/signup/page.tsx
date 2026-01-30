"use client"

import { useState } from "react"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      let data = null
      try {
        data = await res.json()
      } catch {}

      if (!res.ok) {
        setError(data?.message || "Signup failed")
        return
      }

      setSuccess(true)
    } catch {
      setError("Server unreachable. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">
          Create your account
        </h1>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {/* SUCCESS */}
        {success && (
          <p className="text-sm text-green-600 text-center">
            Account created successfully 🎉
          </p>
        )}

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="you@example.com"
            value={email}
            disabled={success}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            disabled={success}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={confirmPassword}
            disabled={success}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className={`w-full rounded-md py-2 font-medium transition
            ${
              success
                ? "bg-green-600 text-white"
                : "bg-black text-white hover:bg-gray-800"
            }
            ${loading && "opacity-70"}
          `}
        >
          {loading
            ? "Creating account..."
            : success
            ? "Account created ✓"
            : "Create account"}
        </button>
      </form>
    </div>
  )
}
