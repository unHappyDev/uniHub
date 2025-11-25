/** @type {import('next').NextConfig} */
const nextConfig = {

  eslint: {
    // Isso faz o build ignorar os erros do ESLint (como variáveis não usadas)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Isso faz o build ignorar os erros do TypeScript (como o uso de 'any')
    ignoreBuildErrors: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://18.188.33.134:8080/:path*", // back-end Spring Boot
      },
    ];
  },
};

module.exports = nextConfig;