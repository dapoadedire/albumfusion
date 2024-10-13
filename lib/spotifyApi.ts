

const BASE_URL = 'https://api.spotify.com/v1';

export const getUserProfile = async (accessToken: string) => {
  
    const response = await fetch(`${BASE_URL}/me`, {
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
};

export const createPlaylist = async (accessToken: string, userId: string, name: string, description: string, isPublic: boolean) => {

    const response = await fetch(`${BASE_URL}/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        name,
        description,
        public: isPublic,
        }),
    });
    const data = await response.json();
    return data;
};

export const getAlbumTracks = async (accessToken: string, albumId: string) => {
    const response = await fetch(`${BASE_URL}/albums/${albumId}/tracks`, {
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data.items;
};

export const addTracksToPlaylist = async (accessToken: string, playlistId: string, trackUris: string[]) => {
    for (let i = 0; i < trackUris.length; i += 100) {
        const uris = trackUris.slice(i, i + 100);
        await fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris }),
        });
    }

};