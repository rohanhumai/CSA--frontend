"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
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
import { Separator } from "@/components/ui/separator"
import { Github } from "lucide-react"

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
    <Card className="border-2 border-border bg-card shadow-xl">
      <CardHeader className="text-center space-y-1 pb-3">
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>
          Continue with Google or GitHub
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* OAuth Buttons */}
        <Button
          variant="outline"
          className="w-full h-10"
          onClick={() => signIn("google")}
        >
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full h-10 gap-2"
          onClick={() => signIn("github")}
        >
          <Github className="size-4" />
          Continue with GitHub
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">
            Or signup with email
          </span>
          <Separator className="flex-1" />
        </div>

        {/* Normal Form */}
        <form onSubmit={handleSignup} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label className="text-sm">First Name</Label>
              <Input className="h-9" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label className="text-sm">Last Name</Label>
              <Input className="h-9" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-1">
            <Label className="text-sm">Email</Label>
            <Input type="email" className="h-9" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="grid gap-1">
            <Label className="text-sm">Password</Label>
            <Input type="password" className="h-9" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {message && (
            <p className="text-xs text-center text-muted-foreground pt-1">
              {message}
            </p>
          )}

          <Button type="submit" disabled={loading} className="h-10 mt-2">
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
