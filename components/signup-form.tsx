"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      })

      const data = await res.json()
      setMessage(data.message)
    } catch (err) {
      setMessage("Something went wrong")
    }

    setLoading(false)
  }

  return (
    <Card className="border shadow-2xl bg-white">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to sign up</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label>First Name</Label>
            <Input className="bg-zinc-50 border-zinc-300 focus:border-black focus:ring-black" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Last Name</Label>
            <Input className="bg-zinc-50 border-zinc-300 focus:border-black focus:ring-black" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <Input className="bg-zinc-50 border-zinc-300 focus:border-black focus:ring-black" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Password</Label>
            <Input className="bg-zinc-50 border-zinc-300 focus:border-black focus:ring-black" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {message && (
            <p className="text-sm text-center text-muted-foreground">
              {message}
            </p>
          )}

          <Button className="bg-black text-white hover:bg-zinc-800 transition-all" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
