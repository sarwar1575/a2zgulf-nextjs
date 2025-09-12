/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co"],
  },
  async redirects() {
    return [
      {
        source: "/seller/dashboard",
        destination: "/dashboard",
        permanent: false, // 307
      },
    ];
  },
  async rewrites() {
    return [
      // browser -> /api/... (same-origin) ; Next server -> https://api.a2zgulf.com/api/...
      {
        source: "/api/:path*",
        destination: "https://api.a2zgulf.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
