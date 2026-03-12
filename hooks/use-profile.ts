"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./use-auth"
import type { UserProfile } from "@/types/auth.types"

export function useProfile() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(({ profile }) => {
        setProfile(profile)
        setLoading(false)
      })
  }, [user])

  return { profile, loading: authLoading || loading }
}
