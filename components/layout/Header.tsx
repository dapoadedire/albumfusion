"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-purple-700 to-blue-500 dark:from-purple-900 dark:to-blue-900 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 z-10">
          <div className="relative w-10 h-10 rounded-full bg-white p-1 shadow-md">
            {/* Logo SVG - Simple AF (AlbumFusion) logo */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <rect width="100" height="100" rx="50" fill="white" />
              <path
                d="M30 30 L30 70 L50 50 L30 30"
                fill="#6D28D9" // Purple-700
              />
              <path
                d="M55 30 L75 30 L75 70 L55 70 L55 30"
                fill="#3B82F6" // Blue-500
              />
              <circle cx="65" cy="50" r="10" fill="white" opacity="0.3" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl">AlbumFusion</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className="text-white hover:text-gray-200 transition duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/dapoadedire/albumfusion"
                  target="_blank"
                  className="text-white hover:text-gray-200 transition duration-200"
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-r from-purple-700 to-blue-500 dark:from-purple-900 dark:to-blue-900 z-20 shadow-lg">
          <nav className="container mx-auto px-4 py-3">
            <ul className="flex flex-col space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-white hover:text-gray-200 transition duration-200 block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white hover:text-gray-200 transition duration-200 block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li className="py-2">
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
