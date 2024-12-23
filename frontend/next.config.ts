import type { NextConfig } from "next";
const { createProxyMiddleware } = require('http-proxy-middleware');

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },

  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/v1/:path*'  // Proxy to NestJS backend
      }
    ];
  },
};

export default nextConfig;
