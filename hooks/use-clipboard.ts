"use client"
import { useState, useCallback } from "react"

export function useClipboard(timeout = 2000): { copied: boolean; copy: (text: string) => Promise<void> } {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    } catch { /* ignore */ }
  }, [timeout])
  return { copied, copy }
}
