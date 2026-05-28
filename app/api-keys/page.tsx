"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { Header } from "@/components/header"

interface KeyResponse {
  key: string
  prefix: string
  label: string | null
  email: string
  rate_limit_per_minute: number
  notice: string
}

export default function ApiKeysPage() {
  const [email, setEmail] = useState("")
  const [label, setLabel] = useState("")
  const [loading, setLoading] = useState(false)
  const [issued, setIssued] = useState<KeyResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setIssued(null)
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, label }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed")
        return
      }
      setIssued(data as KeyResponse)
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  function copyKey() {
    if (!issued) return
    navigator.clipboard.writeText(issued.key).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          API key registration
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Free for research and personal use. With a key you get 120 requests/min instead of 30.
          Read the <Link href="/api-docs" className="underline text-green-700">API docs</Link> first.
        </p>

        {!issued && (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-yellow-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1">
                Label <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                maxLength={80}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="my-research-project"
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-yellow-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-black bg-black text-white px-4 py-3 font-bold uppercase tracking-wide hover:bg-green-700 hover:border-green-700 transition disabled:opacity-50"
            >
              {loading ? "Generating…" : "Generate API key"}
            </button>
            {error && (
              <div className="border-2 border-red-500 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </form>
        )}

        {issued && (
          <div className="mt-8 border-4 border-emerald-600 bg-emerald-50 p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Your API key — shown once
            </div>
            <div className="mt-3 font-mono text-sm break-all bg-white p-3 border-2 border-emerald-700">
              {issued.key}
            </div>
            <button
              onClick={copyKey}
              className="mt-3 border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide hover:bg-gray-100"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <p className="mt-4 text-xs text-gray-700">{issued.notice}</p>
            <p className="mt-2 text-xs text-gray-600">
              Use it via the <code className="bg-white px-1">X-API-Key</code> header.
              See <Link href="/api-docs" className="underline">API docs</Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
