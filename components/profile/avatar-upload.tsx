"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function AvatarUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.")
      return
    }

    setUploading(true)
    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/profile/avatar", { method: "POST", body: form })
    if (res.ok) {
      const { url } = await res.json()
      onUpload(url)
      toast.success("Avatar updated")
    } else {
      toast.error("Upload failed")
    }
    setUploading(false)
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading…" : "Upload photo"}
      </Button>
    </>
  )
}
