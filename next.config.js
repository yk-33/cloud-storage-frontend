/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api.simple-cloud-storage.click',
        port: '80',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;


