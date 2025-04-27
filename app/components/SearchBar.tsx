"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    onSearch(value); // call search immediately (or after debounce if you setup)
  };

  return (
    <input
      type="text"
      value={input}
      onChange={handleChange}
      placeholder="Search blogs..."
      className="p-2 w-full sm:w-80 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  );
}
