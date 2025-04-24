// app/blog/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function BlogDetailPage() {
  const { id } = useParams()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`)
        if (!res.ok) throw new Error('Failed to fetch blog')
        const data = await res.json()
        setBlog(data.data)
      } catch (err) {
        console.error('Error fetching blog:', err)
        setError('Failed to load blog')
      } finally {
        setLoading(false)
      }
    }
    
    fetchBlog()
  }, [id])

  const handleGenerateSummary = async () => {
    if (!blog?.attributes?.field_blog_content) {
      setError('No blog content available')
      return
    }

    try {
      console.log('Generating summary for:', blog.attributes.field_blog_content)
      setSummaryLoading(true)
      setShowSummary(true)
      setError('')
      
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: typeof blog.attributes.field_blog_content === 'string'
            ? blog.attributes.field_blog_content
            : JSON.stringify(blog.attributes.field_blog_content)
        }),
      })

      console.log('Summary API response status:', res.status)
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Summary generation failed')
      }

      const data = await res.json()
      console.log('Received summary:', data)
      setSummary(data.summary)
    } catch (err: any) {
      console.error('Summary error:', err)
      setError(err.message || 'Failed to generate summary')
    } finally {
      setSummaryLoading(false)
    }
  }

  if (loading) return <div className="p-6 text-white">Loading blog...</div>
  if (error && !blog) return <div className="p-6 text-red-500">{error}</div>
  if (!blog) return <div className="p-6 text-red-500">Blog not found.</div>

  return (
    <main className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{blog.attributes.title}</h1>
      <p className="text-sm text-gray-400 mb-6">
        Published on {new Date(blog.attributes.created).toLocaleDateString()}
      </p>

      <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
        <Image
          src={blog.relationships?.field_image?.data?.id 
               ? `/images/${blog.relationships.field_image.data.id}.jpg` 
               : '/fallback.jpg'}
          alt={blog.attributes.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="mb-6">
        {typeof blog.attributes.field_blog_content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: blog.attributes.field_blog_content }} />
        ) : (
          <pre>{JSON.stringify(blog.attributes.field_blog_content, null, 2)}</pre>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={handleGenerateSummary}
          disabled={summaryLoading}
          className={`px-6 py-2 rounded-full font-semibold shadow-md transition ${
            summaryLoading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-xl'
          }`}
        >
          {summaryLoading ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      {showSummary && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-900 rounded">
          <strong>Summary:</strong> {summary || 'No summary generated yet'}
        </div>
      )}
    </main>
  )
}