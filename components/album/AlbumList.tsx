import React from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
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
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <div
    className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden 
    transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 
    dark:shadow-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

const AlbumList: React.FC<AlbumListProps> = ({ albums, onRemoveAlbum }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Album List</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {albums.length > 0 ? (
          albums.map((album) => (
            <Card key={album.id}>
              <div className="relative group">
                <Image
                  src={album.images[1]?.url || "/api/placeholder/300/300"}
                  alt={`${album.name} cover`}
                  width={200}
                  height={200}
                  className="w-full h-auto aspect-square object-cover transition-all duration-300 group-hover:brightness-90"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => onRemoveAlbum(album.id)}
                    className="bg-white/90 dark:bg-gray-800/90 text-red-500 hover:text-red-700 hover:bg-white dark:hover:bg-gray-700 transition-colors
                    w-8 h-8 flex items-center justify-center rounded-full shadow-md"
                    aria-label="Remove album"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3 mt-1 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 transition-colors duration-300">
                <h3 className="font-semibold text-base truncate dark:text-gray-100">
                  {album.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {album.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p>
              No albums selected yet. Search and add albums to create your
              playlist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumList;
