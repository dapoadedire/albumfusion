"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const getToken = async (code: string): Promise<void> => {
    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      setError('Code verifier not found in local storage');
      setIsLoading(false);
      return;
    }

    const payload = new URLSearchParams({
      client_id: clientId!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri!,
      code_verifier: codeVerifier,
    });

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch access token');
      }

      const { access_token } = await response.json();
      localStorage.setItem('access_token', access_token);
      setAccessToken(access_token);
      setError(null);
      window.history.replaceState({}, document.title, "/");
    } catch (error) {
      console.error('Error during token retrieval:', error);
      setError('Failed to retrieve access token');
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
      setIsLoading(false);
    } else {
      const code = searchParams.get('code');
      if (code) {
        getToken(code);
      } else {
        setIsLoading(false);
      }
    }
  }, [searchParams]);

  if (isLoading) {
    return <main className="container mx-auto p-4"><p>Loading...</p></main>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Album Merge</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {accessToken ? (
        <p className="mb-4">You are logged in!</p>
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