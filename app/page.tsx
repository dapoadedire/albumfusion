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
                <div className="mt-6 p-6 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Your playlist has been created!
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                    <a
                      href={playlistUrl}
                      target="_blank"
                      className="flex items-center justify-center bg-[#1DB954] hover:bg-[#1ed760] text-white py-2.5 px-5 rounded-full shadow-md transition-colors duration-300 font-medium"
                      rel="noopener noreferrer"
                      aria-label="View your playlist on Spotify"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.34c-.19.33-.65.44-.98.24-2.7-1.65-6.08-2.02-10.06-1.1-.35.08-.71-.13-.79-.48-.08-.35.13-.71.48-.79 4.35-1 8.1-.57 11.11 1.24.33.19.44.65.24.98v-.09zm1.23-2.76c-.24.41-.77.55-1.18.31-3.09-1.9-7.8-2.45-11.43-1.34-.47.14-.96-.12-1.1-.59-.14-.47.12-.96.59-1.1 4.15-1.26 9.3-.64 12.8 1.54.41.25.55.77.31 1.18h.01zm.11-2.86c-3.71-2.2-9.82-2.4-13.36-1.33-.57.17-1.16-.15-1.33-.71-.17-.57.15-1.16.71-1.33 4.07-1.23 10.82-1 15.04 1.53.53.31.7 1 .39 1.52-.31.53-1 .7-1.52.39l.07-.07z" />
                      </svg>
                      View on Spotify
                    </a>
                    <button
                      onClick={handleCopyLink}
                      aria-label="Copy playlist link to clipboard"
                      className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-5 rounded-full shadow-md transition-all duration-300 font-medium"
                    >
                      {copySuccess ? (
                        <>
                          <svg
                            className="w-5 h-5 mr-2 animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            ></path>
                          </svg>
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 italic">
                    Share this playlist with your friends and enjoy your curated
                    music collection!
                  </p>
                  {copySuccess && (
                    <div className="mt-2 py-1.5 px-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-sm inline-flex items-center animate-fadeIn">
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      {copySuccess}
                    </div>
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
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 pb-4 px-4 sm:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-300">
              Welcome to AlbumFusion
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-center max-w-2xl">
              Create playlists with your favorite albums in just a few clicks.
            </p>

            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-green-600 rounded-full blur opacity-60 group-hover:opacity-90 transition duration-500"></div>
                <button
                  onClick={() => authenticate()}
                  className="relative flex items-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl shadow-md"
                  aria-label="Connect with Spotify"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.34c-.19.33-.65.44-.98.24-2.7-1.65-6.08-2.02-10.06-1.1-.35.08-.71-.13-.79-.48-.08-.35.13-.71.48-.79 4.35-1 8.1-.57 11.11 1.24.33.19.44.65.24.98v-.09zm1.23-2.76c-.24.41-.77.55-1.18.31-3.09-1.9-7.8-2.45-11.43-1.34-.47.14-.96-.12-1.1-.59-.14-.47.12-.96.59-1.1 4.15-1.26 9.3-.64 12.8 1.54.41.25.55.77.31 1.18h.01zm.11-2.86c-3.71-2.2-9.82-2.4-13.36-1.33-.57.17-1.16-.15-1.33-.71-.17-.57.15-1.16.71-1.33 4.07-1.23 10.82-1 15.04 1.53.53.31.7 1 .39 1.52-.31.53-1 .7-1.52.39l.07-.07z" />
                  </svg>
                  Connect with Spotify
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">
                No Spotify account?{" "}
                <a
                  href="https://www.spotify.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                >
                  Sign up for free
                </a>
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 justify-center text-center">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Free to use</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Secure authentication</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Instant playlist creation</span>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="py-16 pt-8 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl my-8 shadow-inner">
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
                  Name your playlist, add a description, and we&apos;ll create it in
                  your Spotify account
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
