/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig