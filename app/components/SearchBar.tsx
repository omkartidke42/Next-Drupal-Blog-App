'use client'

import { useState } from "react"

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    if (query.trim() !== "") {
      onSearch(query)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center mb-6 w-full">
      <input
        className="flex-grow px-4 py-2 rounded-lg border border-gray-600 bg-zinc-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search blogs..."
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
      >
        Search
      </button>
    </div>
  )
}
