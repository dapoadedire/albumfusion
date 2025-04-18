import Link from "next/link";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-700 to-blue-500 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
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
                href="/about"
                className="text-white hover:text-gray-200 transition duration-200"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
