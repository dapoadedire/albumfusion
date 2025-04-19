/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ["i.scdn.co", "albumfusion.xyz", "albumfusion.vercel.app"],
  },
};

export default nextConfig;
