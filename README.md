# AlbumFusion

A Next.js application for searching albums and managing playlists via the Spotify API.

## Features

- Search for albums
- View album tracks
- Create playlists and add tracks
- User authentication with Spotify (OAuth2)
- Responsive UI built with Tailwind CSS

## Tech Stack

- Next.js (App Router)
- React & TypeScript
- Tailwind CSS
- Axios for HTTP requests

## Prerequisites

- Node.js v18 or later
- npm or yarn
- A Spotify Developer account with a registered app

## Environment Variables

Create a `.env.local` file in the project root and add:

```bash
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000
```

## Installation & Development

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/albumfusion.git
   cd albumfusion
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Production Build & Start

```bash
npm run build && npm run start
# or
yarn build && yarn start
```

## Project Structure

```
app/           Next.js routes and layouts
components/    UI components (album search, playlist form, etc.)
lib/           Axios setup and Spotify API wrappers
utils/         Utility functions and schemas
public/        Static assets (images, gifs)
```

## License

This project is licensed under the MIT License.
