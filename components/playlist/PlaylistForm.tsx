import React, { useState } from "react";

interface PlaylistFormProps {
  onCreatePlaylist: (
    name: string,
    description: string,
    isPublic: boolean
  ) => Promise<void>;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({ onCreatePlaylist }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [publicPlaylist, setPublicPlaylist] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleCreatePlaylist = async () => {
    setIsLoading(true); // Start loading
    try {
      await onCreatePlaylist(playlistName, playlistDescription, publicPlaylist);
    } finally {
      setIsLoading(false); // Stop loading after the process finishes
    }
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
        className="border p-2 w-96 border-gray-300"
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
        className="border border-gray-300 p-2 w-96"
      />
      <div className="flex items-center my-4 gap-2">
        <input
          id="public-playlist"
          type="checkbox"
          className="border p-2"
          checked={publicPlaylist}
          onChange={(e) => setPublicPlaylist(e.target.checked)}
        />
        <label htmlFor="public-playlist" className="block font-bold">
          Public Playlist
        </label>
      </div>
      <button
        onClick={handleCreatePlaylist}
        className={` text-white p-2 rounded mt-4 
            ${isLoading? "bg-green-300": "bg-green-500"}
            `}
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? "Creating..." : "Create Playlist"}{" "}
        {/* Show "Creating..." when loading */}
      </button>
    </div>
  );
};

export default PlaylistForm;
