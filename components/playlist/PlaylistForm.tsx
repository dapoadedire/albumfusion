import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { playlistSchema } from "@/lib/schema";
import { Loader2, Music, ListMusic } from "lucide-react";

interface PlaylistFormProps {
  onCreatePlaylist: (
    name: string,
    description: string,
    isPublic: boolean
  ) => Promise<void>;
}

type PlaylistFormData = z.infer<typeof playlistSchema>;

const PlaylistForm: React.FC<PlaylistFormProps> = ({ onCreatePlaylist }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlaylistFormData>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
    },
  });

  const onSubmit = async (data: PlaylistFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await onCreatePlaylist(data.name, data.description, data.isPublic);
      reset();
    } catch (err: any) {
      setError(err.message || "Failed to create playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold sm:text-2xl dark:text-gray-100 flex items-center gap-2">
          <ListMusic className="h-6 w-6" />
          Create Playlist
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Fill out the form to create a new Spotify playlist
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Playlist Name
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Music size={18} />
            </div>
            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Enter playlist name"
              className="pl-10 w-full border p-2.5 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200
                shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Playlist Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Enter a description for your playlist"
            rows={3}
            className="w-full border p-2.5 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200
              shadow-sm hover:border-gray-400 dark:hover:border-gray-500 resize-none"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="isPublic"
            type="checkbox"
            {...register("isPublic")}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 
              dark:bg-gray-800 dark:checked:bg-blue-600 dark:focus:ring-offset-gray-800"
          />
          <label
            htmlFor="isPublic"
            className="ml-2 block font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Public Playlist
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2 focus:ring-2 
              text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm
              disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <ListMusic className="h-5 w-5" />
                <span>Create Playlist</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaylistForm;
