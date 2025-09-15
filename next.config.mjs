// next.config.mjs
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.a2zgulf.com/api').replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ibb.co'],
  },
  async redirects() {
    return [
      { source: '/seller/dashboard', destination: '/dashboard', permanent: false },
    ];
  },
  
  
};

export default nextConfig;
