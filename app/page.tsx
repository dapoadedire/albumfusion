"use client";

import React, { useState, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import AlbumSearch from "@/components/album/AlbumSearch";
import AlbumList from "@/components/album/AlbumList";
import PlaylistForm from "@/components/playlist/PlaylistForm";
import * as SpotifyAPI from "@/lib/spotifyApi";
import Image from "next/image";

interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { height: number; url: string; width: number }[];
}

export default function Home() {
  const { accessToken, isLoading, error, authenticate, logout } = useAuth();
  const [selectedAlbums, setSelectedAlbums] = useState<Album[]>([]);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [createPlaylistError, setCreatePlaylistError] = useState<string | null>(
    null
  );

  const handleCopyLink = useCallback(() => {
    if (playlistUrl) {
      navigator.clipboard
        .writeText(playlistUrl)
        .then(() => {
          setCopySuccess("Link copied to clipboard!");
          setTimeout(() => setCopySuccess(null), 3000);
        })
        .catch(() => setCopySuccess("Failed to copy link"));
    }
  }, [playlistUrl]);

  const handleAlbumSelect = useCallback((album: Album) => {
    setSelectedAlbums((prev) => {
      if (!prev.find((a) => a.id === album.id)) {
        return [...prev, album];
      }
      return prev;
    });
  }, []);

  const handleRemoveAlbum = useCallback((albumId: string) => {
    setSelectedAlbums((prev) => prev.filter((album) => album.id !== albumId));
  }, []);

  const handleCreatePlaylist = useCallback(
    async (name: string, description: string, isPublic: boolean) => {
      try {
        setCreatePlaylistError(null);

        if (selectedAlbums.length < 2) {
          throw new Error("Please select at least two albums");
        }

        if (!accessToken) {
          throw new Error("You must be authenticated to create a playlist");
        }

        const user = await SpotifyAPI.getUserProfile();
        const playlist = await SpotifyAPI.createPlaylist(
          user.id,
          name,
          description,
          isPublic
        );

        await Promise.all(
          selectedAlbums.map(async (album) => {
            const tracks = await SpotifyAPI.getAlbumTracks(album.id);
            const trackUris = tracks.map((track: any) => track.uri);
            return SpotifyAPI.addTracksToPlaylist(playlist.id, trackUris);
          })
        );

        setPlaylistUrl(playlist.external_urls.spotify);
      } catch (err) {
        setCreatePlaylistError(
          err instanceof Error
            ? err.message
            : "An error occurred while creating the playlist"
        );
      }
    },
    [accessToken, selectedAlbums]
  );

  if (isLoading) {
    return (
      <main className="container mx-auto p-4 flex items-center justify-center h-screen">
        <Image
          src="/loading.gif"
          alt="Loading spinner"
          width={50}
          height={50}
          className="mx-auto"
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-4 flex items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      {accessToken ? (
        <div>
          <div className="flex justify-end">
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
            >
              Logout
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="mt-4 p-4 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
              <AlbumSearch onAlbumSelect={handleAlbumSelect} />
            </div>
            <div className="mt-4 p-4 border border-gray-400 dark:border-gray-600 rounded flex flex-col gap-y-6 bg-white dark:bg-gray-800">
              <PlaylistForm onCreatePlaylist={handleCreatePlaylist} />
              {createPlaylistError && (
                <p className="text-red-500 mt-2">{createPlaylistError}</p>
              )}
              {playlistUrl && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Your playlist has been created:
                  </p>
                  <div className="flex items-center space-x-4">
                    <a
                      href={playlistUrl}
                      target="_blank"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                      rel="noopener noreferrer"
                    >
                      View your playlist on Spotify
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow-md transition-colors duration-300"
                    >
                      {copySuccess ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                  {copySuccess && (
                    <p className="text-green-600 mt-2 text-sm font-medium">
                      {copySuccess}
                    </p>
                  )}
                </div>
              )}
              <AlbumList
                albums={selectedAlbums}
                onRemoveAlbum={handleRemoveAlbum}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-300">
              Welcome to AlbumFusion
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 text-center max-w-2xl">
              Create playlists with your favorite albums in just a few clicks.
            </p>
            <button
              onClick={() => authenticate()}
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl shadow-md"
            >
              Get Started with Spotify
            </button>
          </div>

          {/* How It Works Section */}
          <div className="py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl my-8 shadow-inner">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                How AlbumFusion Works
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
                Creating playlists from your favorite albums has never been
                easier
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700 rounded-full flex items-center justify-center text-white text-xl font-bold mb-5 mx-auto shadow-md">
                  1
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 dark:text-gray-100">
                  Sign In
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Connect your Spotify account securely with just one click
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 rounded-full flex items-center justify-center text-white text-xl font-bold mb-5 mx-auto shadow-md">
                  2
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 dark:text-gray-100">
                  Select Albums
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Search and pick your favorite albums to include in your
                  playlist
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300 sm:col-span-2 md:col-span-1 sm:mx-auto sm:max-w-md md:max-w-none">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold mb-5 mx-auto shadow-md">
                  3
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 dark:text-gray-100">
                  Create Playlist
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Name your playlist, add a description, and we'll create it in
                  your Spotify account
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4 sm:px-0">
              <div className="flex items-center">
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
                      <circle
                        cx="65"
                        cy="50"
                        r="10"
                        fill="white"
                        opacity="0.3"
                      />
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
                <span className="text-gray-800 dark:text-gray-200 font-semibold ml-2 text-lg">
                  AlbumFusion
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                © {new Date().getFullYear()} AlbumFusion. All rights reserved.
              </div>

              <div className="flex space-x-6">
                <a
                  href="https://github.com/yourusername/albumfusion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label="GitHub"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label="Spotify"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.305-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.786-2.13-9.965-1.166a.78.78 0 01-.973-.516.781.781 0 01.517-.972c3.632-1.102 8.147-.568 11.236 1.325a.78.78 0 01.257 1.072zm.105-2.835c-3.222-1.91-8.54-2.09-11.618-1.156a.935.935 0 11-.542-1.79c3.532-1.072 9.404-.865 13.115 1.338a.936.936 0 11-.955 1.608z" />
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
