/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
  },

  /**
   * Proxy /api/backend/* → Flask backend so the browser never makes
   * cross-origin requests and we avoid any CORS issues in development.
   *
   * Set NEXT_PUBLIC_BACKEND_URL in your .env.local to point at your
   * running Flask instance (defaults to http://localhost:5000).
   */
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
