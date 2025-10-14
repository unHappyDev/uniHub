/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8443/:path*", // back-end Spring Boot
      },
    ];
  },
};

module.exports = nextConfig;