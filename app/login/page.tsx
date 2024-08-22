"use client";
import { sha256, base64encode, generateRandomString } from './utils';

const SpotifyAuth: React.FC = () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const scope = 'user-read-private user-read-email';

  const authenticate = async () => {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    localStorage.setItem('code_verifier', codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId!,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri!,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Spotify Authentication</h1>
      <button
        onClick={authenticate}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default SpotifyAuth;