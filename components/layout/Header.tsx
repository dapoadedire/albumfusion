"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/auth/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { accessToken, logout, authenticate } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-purple-700 to-blue-500 dark:from-purple-900 dark:to-blue-900 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 z-10">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[2px] shadow-lg">
            <div className="bg-white dark:bg-gray-800 rounded-full p-1 w-full h-full">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M30 30 L30 70 L50 50 L30 30"
                  fill="url(#purple-gradient)"
                />
                <path
                  d="M55 30 L75 30 L75 70 L55 70 L55 30"
                  fill="url(#blue-gradient)"
                />
                <circle cx="65" cy="50" r="10" fill="white" opacity="0.3" />
                <defs>
                  <linearGradient
                    id="purple-gradient"
                    x1="30"
                    y1="30"
                    x2="50"
                    y2="70"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6D28D9" />
                  </linearGradient>
                  <linearGradient
                    id="blue-gradient"
                    x1="55"
                    y1="30"
                    x2="75"
                    y2="70"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
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
            <ul
              className="flex space-x-6
            
            items-center
            "
            >
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
              {accessToken ? (
                <li>
                  <button
                    onClick={logout}
                    className="text-white hover:text-gray-200 transition duration-200"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={authenticate}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-1.5 rounded-full text-md font-semibold transition duration-300 shadow-md hover:shadow-lg flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.34c-.19.33-.65.44-.98.24-2.7-1.65-6.08-2.02-10.06-1.1-.35.08-.71-.13-.79-.48-.08-.35.13-.71.48-.79 4.35-1 8.1-.57 11.11 1.24.33.19.44.65.24.98v-.09zm1.23-2.76c-.24.41-.77.55-1.18.31-3.09-1.9-7.8-2.45-11.43-1.34-.47.14-.96-.12-1.1-.59-.14-.47.12-.96.59-1.1 4.15-1.26 9.3-.64 12.8 1.54.41.25.55.77.31 1.18h.01zm.11-2.86c-3.71-2.2-9.82-2.4-13.36-1.33-.57.17-1.16-.15-1.33-.71-.17-.57.15-1.16.71-1.33 4.07-1.23 10.82-1 15.04 1.53.53.31.7 1 .39 1.52-.31.53-1 .7-1.52.39l.07-.07z" />
                    </svg>
                    Login with Spotify
                  </button>
                </li>
              )}
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
                  href="https://github.com/dapoadedire/albumfusion"
                  target="_blank"
                  className="text-white hover:text-gray-200 transition duration-200 block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              {accessToken ? (
                <li>
                  <button
                    onClick={logout}
                    className="text-white hover:text-gray-200 transition duration-200 block py-2"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={authenticate}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-md font-semibold transition duration-300 shadow-md hover:shadow-lg w-full my-2 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.34c-.19.33-.65.44-.98.24-2.7-1.65-6.08-2.02-10.06-1.1-.35.08-.71-.13-.79-.48-.08-.35.13-.71.48-.79 4.35-1 8.1-.57 11.11 1.24.33.19.44.65.24.98v-.09zm1.23-2.76c-.24.41-.77.55-1.18.31-3.09-1.9-7.8-2.45-11.43-1.34-.47.14-.96-.12-1.1-.59-.14-.47.12-.96.59-1.1 4.15-1.26 9.3-.64 12.8 1.54.41.25.55.77.31 1.18h.01zm.11-2.86c-3.71-2.2-9.82-2.4-13.36-1.33-.57.17-1.16-.15-1.33-.71-.17-.57.15-1.16.71-1.33 4.07-1.23 10.82-1 15.04 1.53.53.31.7 1 .39 1.52-.31.53-1 .7-1.52.39l.07-.07z" />
                    </svg>
                    Login with Spotify
                  </button>
                </li>
              )}
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
