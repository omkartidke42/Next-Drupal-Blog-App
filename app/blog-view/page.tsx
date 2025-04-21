import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/blog/view')
        if (!res.ok) {
          throw new Error('Failed to load blogs')
        }
        const data = await res.json()
        setBlogs(data.data || [])  // Adjust this based on the actual structure of the data
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setError('Failed to load blogs')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <main className="p-6 bg-inherit min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-center">No blogs found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {blogs.map((blog: any) => {
              const imageUrl = blog.field_images?.[0]?.uri?.url
                ? `http://drupal.ddev.site${blog.field_images[0].uri.url}`
                : 'https://via.placeholder.com/400x200'

              return (
                <div key={blog.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                  <Image
                    src={imageUrl}
                    alt={blog.title || 'Blog image'}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2 hover:underline">{blog.title}</h2>
                    <p className="text-sm text-gray-400">
                      Created on: {new Date(blog.created).toLocaleDateString()}
                    </p>
                    <Link href={blog.path?.alias || `/blog/${blog.id}`}>
                      <button className="mt-2 px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700">
                        Read More
                      </button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </main>
  )
}
