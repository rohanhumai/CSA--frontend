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
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to sign up</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label>First Name</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Last Name</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {message && (
            <p className="text-sm text-center text-muted-foreground">
              {message}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
