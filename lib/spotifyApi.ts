import createAxiosInstance from "./axios";


const axiosSpotify = createAxiosInstance();

export const getUserProfile = async () => {
  const response = await axiosSpotify.get("/me");
  return response.data;
};

export const createPlaylist = async (
  userId: string,
  name: string,
  description: string,
  isPublic: boolean
) => {
  const response = await axiosSpotify.post(`/users/${userId}/playlists`, {
    name,
    description,
    public: isPublic,
  });
  return response.data;
};

export const getAlbumTracks = async (albumId: string) => {
  const response = await axiosSpotify.get(`/albums/${albumId}/tracks`);
  return response.data.items;
};

export const addTracksToPlaylist = async (
  playlistId: string,
  trackUris: string[]
) => {
  await axiosSpotify.post(`/playlists/${playlistId}/tracks`, {
    uris: trackUris,
  });
};

export const searchAlbums = async (searchTerm: string, limit: number) => {
  const response = await axiosSpotify.get(
    `/search?q=${encodeURIComponent(searchTerm)}&type=album&limit=${limit}`
  );
  return response.data.albums.items;
};