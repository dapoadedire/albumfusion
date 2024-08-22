"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AlbumSearch from "../components/AlbumSearch";
import AlbumList from "../components/AlbumList";
interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
}

export default function Home() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const [selectedAlbums, setSelectedAlbums] = useState<Album[]>([]);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [publicPlaylist, setPublicPlaylist] = useState<boolean>(true);
  const [playlistDescription, setPlaylistDescription] = useState<string>("");
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopyLink = () => {
    if (playlistUrl) {
      navigator.clipboard
        .writeText(playlistUrl)
        .then(() => setCopySuccess("Link copied to clipboard!"))
        .catch((error) => setCopySuccess("Failed to copy link"));
    }
  };

  const getToken = async (code: string): Promise<void> => {
    const codeVerifier = localStorage.getItem("code_verifier");
    if (!codeVerifier) {
      setError("Code verifier not found in local storage");
      setIsLoading(false);
      return;
    }

    const payload = new URLSearchParams({
      client_id: clientId!,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri!,
      code_verifier: codeVerifier,
    });

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch access token");
      }

      const { access_token } = await response.json();
      localStorage.setItem("access_token", access_token);
      setAccessToken(access_token);
      setError(null);
      window.history.replaceState({}, document.title, "/");
    } catch (error) {
      console.error("Error during token retrieval:", error);
      setError("Failed to retrieve access token");
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
      setIsLoading(false);
    } else {
      const code = searchParams.get("code");
      if (code) {
        getToken(code);
      } else {
        setIsLoading(false);
      }
    }
  }, [searchParams]);

  const handleAlbumSelect = (album: Album) => {
    if (!selectedAlbums.find((a) => a.id === album.id)) {
      setSelectedAlbums([...selectedAlbums, album]);
    }
  };

  const handleRemoveAlbum = (albumId: string) => {
    setSelectedAlbums(selectedAlbums.filter((album) => album.id !== albumId));
  };

  const createPlaylist = async () => {
    if (selectedAlbums.length < 2) {
      setError("Please select at least two albums");
      return;
    }

    try {
      // 1. Get user ID
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userResponse.json();
      const userId = userData.id;

      // 2. Create a new playlist
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playlistName || "Merged Playlist",

            description:
              playlistDescription || "A playlist created by Album Merge",
            public: publicPlaylist,
          }),
        }
      );
      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;

      // 3. Get tracks from each album and add to playlist
      for (const album of selectedAlbums) {
        const tracksResponse = await fetch(
          `https://api.spotify.com/v1/albums/${album.id}/tracks`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const tracksData = await tracksResponse.json();
        const trackUris = tracksData.items.map((track: any) => track.uri);

        // Add tracks to playlist (maximum 100 tracks per request)
        for (let i = 0; i < trackUris.length; i += 100) {
          const uris = trackUris.slice(i, i + 100);
          await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ uris }),
            }
          );
        }
      }

      // console.log(playlistData.external_urls.spotify);

      // alert("Playlist created successfully!");
      const playlistUrl = playlistData.external_urls.spotify;
      setPlaylistUrl(playlistUrl); // Store the URL in state
    } catch (error) {
      console.error("Error creating playlist:", error);
      setError("Failed to create playlist");
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto p-4">
        <p>Loading...</p>
      </main>
    );
  }
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Album Merge</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {accessToken ? (
        <div>
          <p className="mb-4">You are logged in!</p>
          <AlbumSearch
            accessToken={accessToken}
            onAlbumSelect={handleAlbumSelect}
          />
          <AlbumList
            albums={selectedAlbums}
            onRemoveAlbum={handleRemoveAlbum}
          />

          <div>
            <label htmlFor="playlist-name" className="block font-bold mt-4">
              Playlist Name
            </label>
            <input
              id="playlist-name"
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label
              htmlFor="playlist-description"
              className="block font-bold mt-4"
            >
              Playlist Description
            </label>
            <input
              id="playlist-description"
              type="text"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              placeholder="Enter playlist description"
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="public-playlist" className="block font-bold mt-4">
              Public Playlist
            </label>
            <input
              id="public-playlist"
              type="checkbox"
              checked={publicPlaylist}
              onChange={(e) => setPublicPlaylist(e.target.checked)}
            />
          </div>
          {playlistUrl && (
            <div className="mt-4">
              <p>Your playlist has been created:</p>
              <a
                href={playlistUrl}
                target="_blank"
                className="text-blue-500 underline"
              >
                View your playlist on Spotify
              </a>
              <button
                onClick={handleCopyLink}
                className="bg-gray-500 text-white p-2 rounded ml-4"
              >
                Copy Link
              </button>
              {copySuccess && (
                <p className="text-green-500 mt-2">{copySuccess}</p>
              )}
            </div>
          )}
          <button
            onClick={createPlaylist}
            className="bg-green-500 text-white p-2 rounded mt-4"
            disabled={selectedAlbums.length < 2}
          >
            Create Playlist
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Please log in to continue.</p>
          <Link href="/login">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Log in with Spotify
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}
