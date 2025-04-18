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
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">
            Welcome to AlbumFusion
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Create playlists with your favorite albums in just a few clicks.
          </p>
          <button
            onClick={() => authenticate()}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started with Spotify
          </button>
        </div>
      )}
    </main>
  );
}
