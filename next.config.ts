import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devServer: {
    https: {
      key: "./localhost-key.pem",
      cert: "./localhost.pem"
    }
  },
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com"
      },
      {
        hostname: "res.cloudinary.com"
      },
      {
        hostname: "cdn-images-1.medium.com"
      }
    ]
  },
  compiler: {
    styledComponents: true
  }
};

export default nextConfig;
