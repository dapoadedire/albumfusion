'use client'

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { generateRandomString, base64encode, sha256 } from "@/utils";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  authenticate: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const scope = "user-read-private user-read-email playlist-modify-private playlist-modify-public";

  const authenticate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
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
    } catch (err) {
      setError("An error occurred while initiating authentication.");
      setIsLoading(false);
    }
  }, [clientId, redirectUri]);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  const getToken = useCallback(async (code: string) => {
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

      const { access_token, refresh_token } = await response.json();

      localStorage.setItem("access_token", access_token);
      setAccessToken(access_token);

      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
        setRefreshToken(refresh_token);
      }

      window.history.replaceState({}, document.title, "/");
    } catch (error) {
      console.error("Error retrieving access token:", error);
      setError("An error occurred while retrieving access token.");
    } finally {
      setIsLoading(false);
    }
  }, [clientId, redirectUri]);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);

      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        setAccessToken(storedToken);
        setIsLoading(false);
      } else {
        const code = searchParams.get("code");
        if (code) {
          await getToken(code);
        } else {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
  }, [searchParams, getToken]);

  const value = {
    accessToken,
    refreshToken,
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

export default AuthProvider;