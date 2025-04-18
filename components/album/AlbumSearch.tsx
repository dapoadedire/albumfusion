import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { albumSearchSchema } from "@/lib/schema";
import { searchAlbums } from "@/lib/spotifyApi"; // Using the helper function
import Image from "next/image";

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
      const albums = await searchAlbums(formData.searchTerm, formData.limit); // Using helper
      setSearchResults(albums);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="searchTerm"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            Search Term
          </label>
          <input
            type="text"
            id="searchTerm"
            {...register("searchTerm")}
            placeholder="Search for albums"
            className="border p-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          />
          {errors.searchTerm && (
            <p className="text-red-500 text-sm">{errors.searchTerm.message}</p>
          )}
        </div>

        <div className="flex flex-row items-end gap-4">
          <div className="flex flex-col space-y-2 w-full sm:w-1/3">
            <label
              htmlFor="limit"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Limit Results
            </label>
            <select
              id="limit"
              {...register("limit", { valueAsNumber: true })}
              className="border p-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            {errors.limit && (
              <p className="text-red-500 text-sm">{errors.limit.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex-shrink-0 h-10"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center w-full">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching
              </div>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300">
          <p>{error}</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3 dark:text-gray-200">
            Search Results
          </h2>
          <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-1">
            {searchResults.map((album) => (
              <button
                key={album.id}
                onClick={() => onAlbumSelect(album)}
                className="flex items-center text-left w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
              >
                <div className="flex-shrink-0 mr-3 w-12 h-12 overflow-hidden rounded">
                  {album.images[2] && (
                    <Image
                      src={album.images[2].url}
                      alt={`${album.name} cover`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="overflow-hidden flex-grow">
                  <h3 className="font-medium truncate dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {album.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {album.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && !loading && !error && (
        <div className="mt-6 py-6 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p>Search for albums to add to your playlist</p>
        </div>
      )}
    </div>
  );
};

export default AlbumSearch;
