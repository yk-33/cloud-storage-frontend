/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.simple-cloud-storage.click',
        port: '443',
        pathname: '/images/**',
      },
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '8080',
      //   pathname: '/images/**',
      // },
    ],
  },
};

module.exports = nextConfig;


