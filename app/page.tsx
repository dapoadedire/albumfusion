"use client";

import React, { useState } from 'react';
import { useAuth } from './components/auth/AuthContext';
import AlbumSearch from './components/album/AlbumSearch';
import AlbumList from './components/album/AlbumList';
import PlaylistForm from './components/playlist/PlaylistForm';
import * as SpotifyAPI from './lib/spotifyApi';

interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
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
        .then(() => setCopySuccess('Link copied to clipboard!'))
        .catch(() => setCopySuccess('Failed to copy link'));
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

  const handleCreatePlaylist = async (name: string, description: string, isPublic: boolean) => {
    if (selectedAlbums.length < 2) {
      throw new Error('Please select at least two albums');
    }

    if (accessToken) {
      const user = await SpotifyAPI.getUserProfile(accessToken);
      const playlist = await SpotifyAPI.createPlaylist(accessToken, user.id, name, description, isPublic);

      for (const album of selectedAlbums) {
        const tracks = await SpotifyAPI.getAlbumTracks(accessToken, album.id);
        const trackUris = tracks.map((track: any) => track.uri);
        await SpotifyAPI.addTracksToPlaylist(accessToken, playlist.id, trackUris);
      }

      setPlaylistUrl(playlist.external_urls.spotify);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Album Merge</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {accessToken ? (
        <>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
          <AlbumSearch accessToken={accessToken} onAlbumSelect={handleAlbumSelect} />
          <AlbumList albums={selectedAlbums} onRemoveAlbum={handleRemoveAlbum} />
          <PlaylistForm onCreatePlaylist={handleCreatePlaylist} />
          {playlistUrl && (
            <div className="mt-4">
              <p>Your playlist has been created:</p>
              <a href={playlistUrl} target="_blank" className="text-blue-500 underline" rel="noopener noreferrer">
                View your playlist on Spotify
              </a>
              <button onClick={handleCopyLink} className="bg-gray-500 text-white p-2 rounded ml-4">
                Copy Link
              </button>
              {copySuccess && <p className="text-green-500 mt-2">{copySuccess}</p>}
            </div>
          )}
        </>
      ) : (
        <button onClick={authenticate} className="bg-green-500 text-white px-4 py-2 rounded">
          Login with Spotify
        </button>
      )}
    </main>
  );
};

export default Home;