import React from 'react';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { height: number; url: string; width: number }[];
}

interface AlbumListProps {
  albums: Album[];
  onRemoveAlbum: (albumId: string) => void;
}

// Card components
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`relative bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);



const AlbumList: React.FC<AlbumListProps> = ({ albums, onRemoveAlbum }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Album List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      gap-4">
        {albums.map((album) => (
          <Card key={album.id}>
            <Image
              src={album.images[1]?.url || '/api/placeholder/300/300'}
              alt={`${album.name} cover`}
              width={200}
              height={200}
              // className="w-full h-48 object-cover"
            />
            <div
            className='p-2 mt-2'
            >
            <h3 className="font-semibold text-base truncate">{album.name}</h3>
              <p className="text-sm text-gray-600 truncate">
                {album.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
             <div
             className='absolute top-1 right-1 bg-gray-50/40
            rounded-full
            border border-gray-100
             '
             >
             <button
                onClick={() => onRemoveAlbum(album.id)}
                className="text-red-500 hover:text-red-700 transition-colors
                w-8 h-8 flex items-center justify-center rounded-full
                "
                aria-label="Remove album"
              >
                <Trash2 size={16} />
              </button>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;