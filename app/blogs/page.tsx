'use client'

import { DrupalNode } from "next-drupal"
import axios from "axios"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface Blog {
  id: string;
  attributes: {
    title: string;
    created: string;
  };
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<DrupalNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://drupal.ddev.site/jsonapi/node/blog?include=field_images', {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const imageMap = new Map();
        data.included?.forEach((item: any) => {
          if (item.type === 'file--file') {
            // Build the full URL (Drupal gives relative URLs)
            const fullUrl = `http://drupal.ddev.site${item.attributes.uri.url}`;
            imageMap.set(item.id, fullUrl);
          }
        });

        const blogsWithImages = data.data.map((blog: any) => {
          const imageId = blog.relationships?.field_images?.data?.id;
          const imageUrl = imageId ? imageMap.get(imageId) : null;
          return {
            ...blog,
            imageUrl,
          };
        });

        setBlogs(blogsWithImages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);


  if (loading) return <p className="p-6 text-white">Loading...</p>

  return (
    <main className="p-6 bg-inherit min-h-screen text-white">
      <div className="flex justify-end ">
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:shadow-xl hover:from-blue-600 hover:to-purple-700 transition duration-300">
          Create Blog
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-center">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const imageUrl =
              blog.field_image?.uri?.url || "/fallback.jpg"

            return (
              <div
                key={blog.id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <div>
                  <Image
                    src={blog.imageUrl || "/fallback.jpg"} // <- fallback must exist in /public
                    alt={blog.attributes.title || "Blog image"}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2 hover:underline">
                      {blog.attributes.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Created on: {new Date(blog.attributes.created).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex space-x-3">
                      <Link href={`/blog/${blog.id}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-md transition duration-300 hover:shadow-lg">
                          Read More
                        </button>
                      </Link>

                      <Link href={`/blog/update/${blog.id}`}>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow-md transition duration-300 hover:shadow-lg">
                          Update
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md transition duration-300 hover:shadow-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )

  async function handleDelete(blogId: string) {
    try {
      const res = await axios.delete(`/api/blog/${blogId}`);
      if (res.status === 200) {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
        alert("Blog deleted successfully!");
      } else {
        alert("Error deleting the blog.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete the blog.");
    }
  }
}
