import { createClient } from "./server"

const BUCKET = "avatars"

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const supabase = await createClient()
  const ext = file.name.split(".").pop()
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
