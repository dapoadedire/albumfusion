import React, { createContext, useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { generateRandomString, base64encode, sha256 } from "@/utils";

interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  authenticate: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const scope =
    "user-read-private user-read-email playlist-modify-private playlist-modify-public";

  const authenticate = async () => {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    localStorage.setItem("code_verifier", codeVerifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId!,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri!,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setAccessToken(null);
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

  const value = {
    accessToken,
    isLoading,
    error,
    authenticate,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
