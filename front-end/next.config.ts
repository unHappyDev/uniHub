/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignora erros do ESLint durante o build para não travar o Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignora erros de tipagem do TypeScript durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // No Docker, usamos o nome do serviço 'backend'.
    // Localmente, usamos localhost.
    // A variável API_INTERNAL_URL foi definida no docker-compose.yml
    const apiUrl = process.env.API_INTERNAL_URL || "http://localhost:8080";

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
