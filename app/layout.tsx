import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/ui/ThemeProvider";
import Script from "next/script";

const dm_sans = DM_Sans({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://albumfusion.xyz"),
  title: {
    default: "AlbumFusion - Create Spotify Playlists from Your Favorite Albums",
    template: "%s | AlbumFusion",
  },
  description:
    "Create custom Spotify playlists by combining your favorite albums. Easily search, select, and merge albums into personalized playlists with our intuitive interface. Connect with Spotify and start curating your perfect music collection.",
  keywords: [
    "Spotify playlist creator",
    "album playlist maker",
    "music playlist tool",
    "Spotify integration",
    "playlist management",
    "album fusion",
    "music curation",
  ],
  authors: [{ name: "Dapo Adedire", url: "https://github.com/dapoadedire" }],
  creator: "Dapo Adedire",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://albumfusion.xyz",
    title: "AlbumFusion - Create Spotify Playlists from Your Favorite Albums",
    description:
      "Create custom Spotify playlists by combining your favorite albums. Easily search, select, and merge albums into personalized playlists with our intuitive interface.",
    siteName: "AlbumFusion",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AlbumFusion - Create Spotify Playlists from Your Favorite Albums",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlbumFusion - Create Spotify Playlists from Your Favorite Albums",
    description:
      "Create custom Spotify playlists by combining your favorite albums. Easily search, select, and merge albums into personalized playlists.",
    creator: "@dapo_adedire",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://albumfusion.xyz",
    languages: {
      "en-US": "https://albumfusion.xyz",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://scripts.simpleanalyticscdn.com/latest.js"
          async
        />
      </head>
      <body className={dm_sans.className}>
        <ThemeProvider>
          <ClientProvider>
            <Header />
            <div className="min-h-screen flex flex-col">
              <div className="flex-grow">{children}</div>
              <Footer />
            </div>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
