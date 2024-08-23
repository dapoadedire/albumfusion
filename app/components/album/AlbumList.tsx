import React, { useState } from 'react';

interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
}
interface AlbumListProps {
  albums: Album[];
  onRemoveAlbum: (albumId: string) => void;
}

const AlbumList: React.FC<AlbumListProps> = ({ albums, onRemoveAlbum }) => {
  const [listName, setListName] = useState('');

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Your Album List</h2>
     
      <ul>
        {albums.map((album) => (
          <li key={album.id} className="flex justify-between items-center mb-2">
            <span>
              {album.name} - {album.artists.map((artist) => artist.name).join(', ')}
            </span>
            <button
              onClick={() => onRemoveAlbum(album.id)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumList;