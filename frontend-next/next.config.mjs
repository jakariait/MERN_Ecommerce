import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';
let backendOrigin = 'http://localhost:5050';
try {
  backendOrigin = new URL(API_URL).origin;
} catch {}

const csp = [
  "default-src 'self'",
  `script-src 'self' ${backendOrigin} https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline' 'unsafe-eval'`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `img-src 'self' data: blob: ${backendOrigin}`,
  "font-src 'self' data: https://fonts.gstatic.com",
  'frame-src https://www.youtube.com https://www.google.com https://www.bkash.com',
  `connect-src 'self' ${backendOrigin} https://www.google-analytics.com`,
  "media-src 'self'",
  "manifest-src 'self'",
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-router-dom': path.resolve(__dirname, './src/lib/router-compat.js'),
    };
    return config;
  },
};

export default nextConfig;