import { NextResponse } from "next/server"
import { getUser } from "@/lib/supabase/session"
import { getBookmarks, toggleBookmark } from "@/lib/supabase/profile"

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const bookmarks = await getBookmarks(user.id)
  return NextResponse.json(bookmarks)
}

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { dealId } = await req.json()
  await toggleBookmark(user.id, dealId)
  return NextResponse.json({ ok: true })
}
