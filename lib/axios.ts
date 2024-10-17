import Axios, { AxiosInstance } from "axios";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

let axiosInstance: AxiosInstance | null = null;

export function createAxiosInstance() {
  if (!axiosInstance) {
    axiosInstance = Axios.create({
      baseURL: SPOTIFY_API_BASE,
    });

    // Set up request interceptor to add the token to every request
    axiosInstance.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    });

    // Set up response interceptor for automatic token refresh
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
            const response = await Axios.post(
              "https://accounts.spotify.com/api/token",
              new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: clientId!,
              }),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            );

            const { access_token } = response.data;

            // Update the access token in localStorage
            localStorage.setItem("access_token", access_token);

            originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

            return axiosInstance!(originalRequest);
          } catch (err) {
            console.error("Error refreshing token:", err);
            // Clear tokens from localStorage
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            // Redirect to home page or login page
            window.location.href = "/";
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  return axiosInstance;
}

export default createAxiosInstance;