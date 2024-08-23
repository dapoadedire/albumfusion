import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider"; // We'll create this next

const dm_sans = DM_Sans({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlbumFusion",
  description: "AlbumFusion lets you create custom playlists by merging albums. Log in with Spotify, search albums, add or remove them from your list, and create a playlist. Your new playlist is instantly added to your Spotify account for a personalized music experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dm_sans.className}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}