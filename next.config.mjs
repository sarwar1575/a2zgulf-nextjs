/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co"], // <-- apna external image domain yaha add karo
  },
};

export default nextConfig;
