"use client"

import Link from "next/link"
import { useEffect } from "react"
import { captureException } from "@/lib/sentry"

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureException(error, { route: "/reports" })
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold tracking-tight">This report couldn&apos;t be loaded</h1>
        <p className="text-sm text-gray-500 mt-2">
          Something went wrong rendering the report. The error has been logged.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mt-1 font-mono">ref: {error.digest}</p>
        )}
        <div className="mt-6 flex gap-2 justify-center">
          <button
            onClick={reset}
            className="border-2 border-black bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-green-700 hover:border-green-700 transition"
          >
            Try again
          </button>
          <Link
            href="/reports"
            className="border-2 border-black px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-gray-100 transition"
          >
            All reports
          </Link>
        </div>
      </div>
    </div>
  )
}
