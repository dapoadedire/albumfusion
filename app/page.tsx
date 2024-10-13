"use client";

import React, { useState } from "react";
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

const Home: React.FC = () => {
  const { accessToken, isLoading, error, authenticate, logout } = useAuth();
  const [selectedAlbums, setSelectedAlbums] = useState<Album[]>([]);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopyLink = () => {
    if (playlistUrl) {
      navigator.clipboard
        .writeText(playlistUrl)
        .then(() => setCopySuccess("Link copied to clipboard!"))
        .catch(() => setCopySuccess("Failed to copy link"));
    }
  };

  const handleAlbumSelect = (album: Album) => {
    if (!selectedAlbums.find((a) => a.id === album.id)) {
      setSelectedAlbums([...selectedAlbums, album]);
    }
  };

  const handleRemoveAlbum = (albumId: string) => {
    setSelectedAlbums(selectedAlbums.filter((album) => album.id !== albumId));
  };

  const handleCreatePlaylist = async (
    name: string,
    description: string,
    isPublic: boolean
  ) => {
    if (selectedAlbums.length < 2) {
      throw new Error("Please select at least two albums");
    }

    if (accessToken) {
      const user = await SpotifyAPI.getUserProfile(accessToken);
      const playlist = await SpotifyAPI.createPlaylist(
        accessToken,
        user.id,
        name,
        description,
        isPublic
      );

      for (const album of selectedAlbums) {
        const tracks = await SpotifyAPI.getAlbumTracks(accessToken, album.id);
        const trackUris = tracks.map((track: any) => track.uri);
        await SpotifyAPI.addTracksToPlaylist(
          accessToken,
          playlist.id,
          trackUris
        );
      }

      setPlaylistUrl(playlist.external_urls.spotify);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto p-4
      flex items-center justify-center h-screen
      ">
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

  return (
    <main className="container mx-auto p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {accessToken ? (
        <main>
          <div className="flex justify-end">
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded
            
            "
            >
              Logout
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="mt-4 p-4 border border-gray-400 rounded">
              <AlbumSearch
                accessToken={accessToken}
                onAlbumSelect={handleAlbumSelect}
              />
            </div>
            <div className="mt-4 p-4 border border-gray-400 rounded flex flex-col gap-y-10 ">
              <PlaylistForm onCreatePlaylist={handleCreatePlaylist} />
              <div>
              {playlistUrl && (
  <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
    <p className="text-lg font-semibold text-gray-800 mb-2">Your playlist has been created:</p>
    <div className="flex items-center space-x-4">
      <a
        href={playlistUrl}
        target="_blank"
        className="text-blue-600 hover:text-blue-800 underline"
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
    {/* {copySuccess && (
      <p className="text-green-600 mt-4 text-sm font-medium">{copySuccess}</p>
    )} */}
  </div>
)}
              </div>
              <AlbumList
                albums={selectedAlbums}
                onRemoveAlbum={handleRemoveAlbum}
              />
           
            </div>
          </div>
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to Spotify Playlist Creator
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Create playlists with your favorite albums in just a few clicks.
          </p>
          <button
            onClick={authenticate}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started with Spotify
          </button>
        </div>
      )}
    </main>
  );
};

export default Home;
