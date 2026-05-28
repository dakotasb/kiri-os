/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@dicebear/core', '@dicebear/collection'],

  async rewrites() {
    const apiUrl = process.env.HERMES_API_URL ?? 'http://localhost:4000';
    return [
      {
        source: '/api/hermes/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
