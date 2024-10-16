import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { playlistSchema } from "@/lib/schema";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaylistFormData>({
    resolver: zodResolver(playlistSchema),
  });

  const onSubmit = async (data: PlaylistFormData) => {
    setIsLoading(true);
    try {
      await onCreatePlaylist(data.name, data.description, data.isPublic);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block font-bold mb-2">Playlist Name</label>
        <input
          type="text"
          {...register("name")}
          placeholder="Enter playlist name"
          className="border p-2 w-96 border-gray-300"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-2">Playlist Description</label>
        <input
          type="text"
          {...register("description")}
          placeholder="Enter playlist description"
          className="border p-2 w-96 border-gray-300"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div
        className="mb-4 
      "
      >
        <label
          className="font-bold flex gap-2
      justify-start items-center "
        >
          <input type="checkbox" {...register("isPublic")} />
          <span>Public Playlist</span>
        </label>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Playlist"}
      </button>
    </form>
  );
};

export default PlaylistForm;
