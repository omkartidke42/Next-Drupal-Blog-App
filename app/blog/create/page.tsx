"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateBlogPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("") // comma-separated UUIDs
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const tagIds = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    const res = await fetch("/api/blog/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        tags: tagIds,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      router.push(data.path || "/")
    } else {
      const errorText = await res.text()
      alert(`Failed to create blog: ${errorText}`)
    }

    setSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Create Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Content</label>
          <textarea
            className="w-full p-2 border rounded text-black"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Tags (UUIDs, comma-separated)</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-black"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          {submitting ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  )
}
