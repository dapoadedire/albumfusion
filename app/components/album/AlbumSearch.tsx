import React, { useState } from 'react';

interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
}

interface AlbumSearchProps {
  accessToken: string;
  onAlbumSelect: (album: Album) => void;
}

const AlbumSearch: React.FC<AlbumSearchProps> = ({ accessToken, onAlbumSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Album[]>([]);

  const searchAlbums = async () => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=album&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setSearchResults(data.albums.items);
    } catch (error) {
      console.error('Error searching albums:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for albums"
        className="border p-2 mr-2"
      />
      <button onClick={searchAlbums} className="bg-blue-500 text-white p-2 rounded">
        Search
      </button>
      <ul className="mt-4">
        {searchResults.map((album) => (
          <li key={album.id} className="mb-2">
            <button
              onClick={() => onAlbumSelect(album)}
              className="text-left hover:bg-gray-100 p-2 w-full"
            >
              {album.name} - {album.artists.map((artist) => artist.name).join(', ')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumSearch;