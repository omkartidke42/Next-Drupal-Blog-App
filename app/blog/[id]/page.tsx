'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function BlogDetailPage() {
  const { id } = useParams()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchBlog = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/blog/${id}`)
        const json = await res.json()
        setBlog(json.data)
      } catch (err) {
        console.error('Error fetching blog:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  if (loading) return <p className="p-6 text-white">Loading...</p>
  if (!blog) return <p className="p-6 text-red-500">Blog not found.</p>

  const { attributes, relationships } = blog
  const title = attributes.title
  const created = new Date(attributes.created).toLocaleDateString()
  const bodyHtml = attributes.body?.value
  const imageId = relationships.field_image?.data?.id
  const imageMap = new Map();

  // If your JSON includes the image URL, replace this with dynamic mapping
  const imageUrl = imageId ? imageMap.get(imageId) : null

  return (
    <main className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-sm text-gray-400 mb-6">Published on {created}</p>

      <div className="w-full h-[300px] relative rounded-lg overflow-hidden mb-6 shadow-lg">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded"
        />
      </div>

      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </main>
  )
}
