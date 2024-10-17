import { z } from "zod";

export const albumSearchSchema = z.object({
  limit: z
    .number()
    .min(10, "Limit must be at least 10")
    .max(50, "Limit can't be more than 50"),
  searchTerm: z
    .string()
    .trim()
    .min(1, { message: "Search term cannot be empty" })
    .max(100, { message: "Search term cannot exceed 100 characters" })
    .refine((value) => !/[^a-zA-Z0-9\s]/.test(value), {
      message: "Search term can only contain letters, numbers, and spaces",
    }),
});

export const playlistSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  description: z.string().min(1, "Playlist description is required"),
  isPublic: z.boolean(),
});
