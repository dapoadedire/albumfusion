import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { albumSearchSchema } from "@/lib/schema";
type AlbumSearchFormData = z.infer<typeof albumSearchSchema>;

interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  album_type: string;
  images: { height: number; url: string; width: number }[];
}

interface AlbumSearchProps {
  accessToken: string;
  onAlbumSelect: (album: Album) => void;
}

interface FilterType {
  type: "album" | "single" | "all";
}

const AlbumSearch: React.FC<AlbumSearchProps> = ({
  accessToken,
  onAlbumSelect,
}) => {
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
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          formData.searchTerm
        )}&type=album&limit=${formData.limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search albums");
      }

      const responseData = await response.json();

      const albums = responseData.albums.items as Album[];

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
          <label htmlFor="searchTerm" className="font-medium text-gray-700">
            Search Term
          </label>
          <input
            type="text"
            id="searchTerm"
            {...register("searchTerm")}
            placeholder="Search for albums"
            className="border p-2 border-gray-300 rounded-md w-full"
          />
          {errors.searchTerm && (
            <p className="text-red-500 text-sm">{errors.searchTerm.message}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="limit" className="font-medium text-gray-700">
            Limit Results
          </label>
          <select
            id="limit"
            {...register("limit", { valueAsNumber: true })}
            className="border p-2 border-gray-300 rounded-md w-full"
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
          className="bg-blue-500 text-white p-2 rounded w-min"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <h2 className="text-lg font-semibold mt-4">Search Results</h2>
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
