"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

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
    } catch {
      setMessage("Something went wrong")
    }

    setLoading(false)
  }

  return (
    <Card className="border-2 border-zinc-300 bg-card/69 backdrop-blur-xl shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">
          Create an account
        </CardTitle>
        <CardDescription className="text-sm">
          Enter your details
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-3">
          <div className="grid gap-1">
            <Label className="text-sm">First Name</Label>
            <Input className="h-9 bg-input/60" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="grid gap-1">
            <Label className="text-sm">Last Name</Label>
            <Input className="h-9 bg-input/60" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="grid gap-1">
            <Label className="text-sm">Email</Label>
            <Input type="email" className="h-9 bg-input/60" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="grid gap-1">
            <Label className="text-sm">Password</Label>
            <Input type="password" className="h-9 bg-input/60" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {message && (
            <p className="text-xs text-center text-muted-foreground pt-1">
              {message}
            </p>
          )}

          <Button type="submit" disabled={loading} className="h-9 mt-2 text-sm shadow-md">
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
