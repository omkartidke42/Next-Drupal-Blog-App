"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BlogEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get authentication token - replace with your actual auth token retrieval
  const getAuthToken = () => {
    // This is just an example - implement your actual token retrieval
    return localStorage.getItem('authToken') || 'dev-token';
  };

  useEffect(() => {
    if (!id) return;
    async function fetchBlog() {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch blog: ${response.status}`);
        }
        const blog = await response.json();
        if (blog) {
          setTitle(blog.title || "");
          setContent(blog.field_blog_content?.[0] || "");
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(`Failed to load blog: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Add the Authorization header with the token
      const token = getAuthToken();
      
      const res = await fetch("/api/blog/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          id, 
          title, 
          content 
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Failed to update blog: ${res.status}`);
      }

      const updatedBlog = await res.json();
      console.log("Blog updated successfully:", updatedBlog);
      router.push(`/blog/${id}`);
    } catch (err) {
      console.error("Error updating blog:", err);
      setError(`Error updating blog: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="py-8">Loading blog...</div>;
  }

  return (
    <div className="text-white p-6 rounded-lg max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Edit Blog</h1>
      {error && <div className="py-2 text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Title</label>
          <input
            type="text"
            className="w-full border-2 border-gray-600 rounded px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Content</label>
          <textarea
            className="w-full border-2 border-gray-600 rounded px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}