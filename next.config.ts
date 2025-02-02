import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "images.unsplash.com",
            },
            {
                hostname: "res.cloudinary.com",
            },
        ],
    },
    compiler: {
        styledComponents: true,
    },
};

export default nextConfig;
