import React, { useState } from "react";
interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { height: number; url: string; width: number }[];
}

interface AlbumSearchProps {
  accessToken: string;
  onAlbumSelect: (album: Album) => void;
}

const AlbumSearch: React.FC<AlbumSearchProps> = ({
  accessToken,
  onAlbumSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Album[]>([]);

  const searchAlbums = async () => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchTerm
        )}&type=album&limit=15`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data.albums.items);
      const albumOnly = data.albums.items.filter(
        (album: any) => album.album_type === "album"
      );
      setSearchResults(albumOnly);
    } catch (error) {
      console.error("Error searching albums:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for albums"
          className="border p-2 border-gray-300 rounded-md mr-2 w-full"
        />
        <button
          onClick={searchAlbums}
          className="bg-blue-500 text-white p-2 rounded w-[100px]"
        >
          Search
        </button>
      </div>
      <ul className="mt-4">
        {searchResults.map((album) => (
          <li key={album.id} className="mb-2">
            <button
              onClick={() => onAlbumSelect(album)}
              className="text-left hover:bg-gray-100 p-2 w-full"
            >
              {album.name} -{" "}
              {album.artists.map((artist) => artist.name).join(", ")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumSearch;
