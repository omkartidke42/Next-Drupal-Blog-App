'use client'

import { DrupalNode } from "next-drupal"
import axios from "axios"
import { useEffect, useState } from "react"
import { motion } from 'framer-motion'
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import SearchBar from "../components/SearchBar"
import { useDebounce } from "use-debounce";

interface Blog {
  id: string;
  attributes: {
    title: string;
    created: string;
  };
  imageUrl?: string;
  field_image?: {
    uri?: {
      url?: string;
    };
  };
}

export default function BlogPage() {

  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  // Add state to hold filtered blogs
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [reactions, setReactions] = useState<{ [key: string]: { [emoji: string]: number } }>({});



  const handleSearch = (searchTerm: string) => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (normalizedSearchTerm === "") {
      setFilteredBlogs([]);
      return;
    }



    const filtered = blogs.filter((blog) => {
      const title = blog.attributes.title.toLowerCase();
      return normalizedSearchTerm
        .split(" ")
        .every((word) => title.includes(word));
    });

    setFilteredBlogs(filtered);
  };

  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleReaction = (blogId: string, emoji: string) => {
    setReactions((prevReactions) => {
      const blogReactions = prevReactions[blogId] || {};
      const currentCount = blogReactions[emoji] || 0;
      return {
        ...prevReactions,
        [blogId]: {
          ...blogReactions,
          [emoji]: currentCount + 1,
        },
      };
    });
  };


  useEffect(() => {
    setLoading(true)

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

  async function handleDelete(blogId: string) {
    if (!blogId) {
      console.error("Blog ID is missing");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.");

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch("/api/blog/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: blogId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to delete blog: ${response.status}`);
      }

      // Show success message
      alert("Blog post deleted successfully!");

      // Update the blogs state to remove the deleted blog
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      alert(`Error deleting blog: ${error.message}`);
    }
  }

  const handleCreateBlog = () => {
    router.push('/blog/create');
  };

  if (loading) return <p className="p-6 text-white">Loading...</p>

  if (error) return <p className="p-6 text-white text-center">Error loading blogs: {error}</p>

  return (
    <main className="p-4 sm:p-6 bg-inherit min-h-screen text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={handleCreateBlog}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-xl hover:from-blue-600 hover:to-purple-700 transition duration-300"
        >
          Create Blog
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center">Latest Blogs</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs found.</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {(filteredBlogs.length > 0 ? filteredBlogs : blogs).map((blog) => {
            const imageUrl = blog.imageUrl || '/fallback.jpg'
            const blogReactions = reactions[blog.id] || {};

            return (
              <motion.div
                key={blog.id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src={imageUrl}
                  alt={blog.attributes.title || 'Blog image'}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 hover:underline">
                    {blog.attributes.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Created on:{' '}
                    {new Date(blog.attributes.created).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/blog/${blog.id}`}>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow transition duration-300">
                        Read More
                      </button>
                    </Link>
                    <Link href={`/blog/update/${blog.id}`}>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow transition duration-300">
                        Update
                      </button>
                    </Link>
                    {/* Reaction Buttons */}

                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex  items-center gap-3 mt-3">
                    {["👍", "🔥", "😍", "🤔"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(blog.id, emoji)}
                        className="text-xl cursor-pointer"
                      >
                        {emoji} {blogReactions[emoji] || 0}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </main>
  )
}