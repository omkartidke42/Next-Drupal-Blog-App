'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import ThemeSwitcher from '../theme-switcher'; // 💡 Add this import

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#141414] border-b-2 text-white px-6 py-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          MyBlog
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-gray-400 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-400 transition">
            About
          </Link>
          <Link href="/blog" className="hover:text-gray-400 transition">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-gray-400 transition">
            Contact
          </Link>
          <ThemeSwitcher /> {/* ✨ Theme button here */}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 space-y-3 px-2 ">
          <Link href="/" className="block hover:text-gray-400" onClick={toggleMenu}>
            Home
          </Link>
          <Link href="/about" className="block hover:text-gray-400" onClick={toggleMenu}>
            About
          </Link>
          <Link href="/blog" className="block hover:text-gray-400" onClick={toggleMenu}>
            Blog
          </Link>
          <Link href="/contact" className="block hover:text-gray-400" onClick={toggleMenu}>
            Contact
          </Link>
          <div className="pt-4">
            <ThemeSwitcher /> {/* ✨ Theme button in mobile too */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
