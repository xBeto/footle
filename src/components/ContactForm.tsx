"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const gold = "#f0d36c"

export function ContactForm({ className }: { className?: string }) {
  const [email, setEmail] = React.useState("")
  const [type, setType] = React.useState<string>("")
  const [message, setMessage] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const isEmailValid = /.+@.+\..+/.test(email)
  const canSubmit = isEmailValid && type !== "" && message.trim().length >= 8

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    // Placeholder: integrate with resend.com later
    // For now, emulate submit
    // eslint-disable-next-line no-console
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setEmail("")
    setType("")
    setMessage("")
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-3", className)}>
      <div>
        <label className="mb-1 block text-sm text-white/85">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="focus-visible:ring-[3px] focus-visible:ring-[rgba(240,211,108,0.35)] focus-visible:border-[rgba(240,211,108,0.65)]"
          aria-invalid={!isEmailValid && email !== ""}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/85">Message type</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full focus-visible:ring-[3px] focus-visible:ring-[rgba(240,211,108,0.35)] focus-visible:border-[rgba(240,211,108,0.65)]">
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent className="bg-[#111e29] text-white border-[1px] border-[#f0d36c]/40">
            <SelectItem value="bug">Report a bug</SelectItem>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="suggestion">Suggestion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/85">Message</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          rows={5}
          className="focus-visible:ring-[3px] focus-visible:ring-[rgba(240,211,108,0.35)] focus-visible:border-[rgba(240,211,108,0.65)]"
          required
        />
        <div className="mt-1 text-xs text-white/60">At least 8 characters.</div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center rounded-md bg-[#f0d36c] px-4 py-2 text-black font-semibold shadow-sm transition hover:brightness-95"
      >
        {submitted ? "Sent!" : "Send"}
      </button>
    </form>
  )
}


