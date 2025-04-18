import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { albumSearchSchema } from "@/lib/schema";
import { searchAlbums } from "@/lib/spotifyApi";
import Image from "next/image";
import { Loader2, Search, Plus } from "lucide-react";

type AlbumSearchFormData = z.infer<typeof albumSearchSchema>;

interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  album_type: string;
  images: { height: number; url: string; width: number }[];
}

interface AlbumSearchProps {
  onAlbumSelect: (album: Album) => void;
}

const AlbumSearch: React.FC<AlbumSearchProps> = ({ onAlbumSelect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Album[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlbumSearchFormData>({
    resolver: zodResolver(albumSearchSchema),
    defaultValues: {
      limit: 15,
      searchTerm: "",
    },
  });

  const onSubmit = async (formData: AlbumSearchFormData) => {
    setLoading(true);
    setError(null);

    try {
      const albums = await searchAlbums(formData.searchTerm, formData.limit);
      setSearchResults(albums);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold sm:text-2xl dark:text-gray-100 flex items-center gap-2">
          <Search className="h-6 w-6" />
          Search Albums
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Find and select albums to add to your playlist
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="searchTerm"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Album Search
          </label>
          <div className="flex items-center relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              id="searchTerm"
              {...register("searchTerm")}
              placeholder="Search for albums"
              className="pl-10 w-full border p-2.5 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200
                shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
          {errors.searchTerm && (
            <p className="text-red-500 text-sm mt-1">
              {errors.searchTerm.message}
            </p>
          )}
        </div>


        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-1/3">
            <label
              htmlFor="limit"
              className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Results to show
            </label>
            <select
              id="limit"
              {...register("limit", { valueAsNumber: true })}
              className="w-full border p-2.5 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200
                shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
            {errors.limit && (
              <p className="text-red-500 text-sm mt-1">
                {errors.limit.message}
              </p>
            )}
          </div>

          <div className="flex items-end sm:ml-auto">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2 focus:ring-2 
                text-white font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 shadow-sm
                disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p>{error}</p>
        </div>
      )}

      <div className="mt-4">
        {searchResults.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Search Results
              </h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                {searchResults.length}
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {searchResults.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => onAlbumSelect(album)}
                    className="flex items-center text-left w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-200 group border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex-shrink-0 mr-3 w-12 h-12 overflow-hidden rounded-md shadow-sm">
                      {album.images[2] ? (
                        <Image
                          src={album.images[2].url}
                          alt={`${album.name} cover`}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium truncate dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {album.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {album.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </div>
                    <div className="ml-2 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                      <Plus className="h-5 w-5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          !loading &&
          !error && (
            <div className="mt-4 py-10 px-4 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <Search className="h-10 w-10 mb-3 text-gray-400 dark:text-gray-500" />
              <p className="max-w-xs">
                Search for albums to add to your playlist
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AlbumSearch;
