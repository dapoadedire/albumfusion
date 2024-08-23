

import React, { useState } from 'react';

interface PlaylistFormProps {
  onCreatePlaylist: (name: string, description: string, isPublic: boolean) => void;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({ onCreatePlaylist }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [publicPlaylist, setPublicPlaylist] = useState(true);

    const handleCreatePlaylist = () => {
        onCreatePlaylist(playlistName, playlistDescription, publicPlaylist);
    };

    return (
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
            <label htmlFor="playlist-description" className="block font-bold mt-4">
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
            <label htmlFor="public-playlist" className="block font-bold mt-4">
                Public Playlist
            </label>
            <input
                id="public-playlist"
                type="checkbox"
                checked={publicPlaylist}
                onChange={(e) => setPublicPlaylist(e.target.checked)}
            />
            <button
                onClick={handleCreatePlaylist}
                className="bg-green-500 text-white p-2 rounded mt-4"
            >
                Create Playlist
            </button>
        </div>
    );
}

export default PlaylistForm;