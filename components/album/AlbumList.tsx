import React from "react";
import { Trash2, Music } from "lucide-react";
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

const AlbumList: React.FC<AlbumListProps> = ({ albums, onRemoveAlbum }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold sm:text-2xl dark:text-gray-100 flex items-center gap-2">
          <Music className="h-6 w-6" />
          Your Album List
        </h2>
        {albums.length > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
            {albums.length}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {albums.length > 0 ? (
          albums.map((album) => (
            <div
              key={album.id}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden 
                transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md 
                border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
            >
              <div className="relative aspect-square overflow-hidden">
                {album.images && album.images[1] ? (
                  <Image
                    src={album.images[1].url}
                    alt={`${album.name} cover`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-all duration-300 group-hover:brightness-90 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <Music className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <div
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/30 
                    transition-all duration-300 pointer-events-none"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAlbum(album.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all 
                    duration-200 ease-in-out bg-white/90 dark:bg-gray-800/90 text-red-500 hover:text-red-600
                    hover:bg-white dark:hover:bg-gray-700 p-1.5 rounded-full shadow-md transform 
                    scale-90 group-hover:scale-100"
                  aria-label={`Remove ${album.name} from your list`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm sm:text-base truncate dark:text-gray-100">
                  {album.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">
                  {album.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div
            className="col-span-full flex flex-col items-center justify-center text-center py-10 px-4 
            text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 
            rounded-xl bg-gray-50 dark:bg-gray-800/50"
          >
            <Music className="h-10 w-10 mb-3 text-gray-400 dark:text-gray-500" />
            <p className="max-w-xs">
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
