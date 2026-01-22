import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "upload.wikimedia.org",
      "images.unsplash.com",
      "michimarketing.com",
      "picsum.photos",
      "i.ytimg.com",
      "cdn.openai.com",
      "placehold.co",
      "res.cloudinary.com",
      "drive.google.com",
    ],
  },

  env: {
    // ✅ ESTE ES EL QUE USA TODO TU FRONT

  },
};

export default nextConfig;
