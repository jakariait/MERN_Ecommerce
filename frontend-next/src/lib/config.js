// Central runtime configuration. All environment-derived values live here so
// pages, metadata, sitemap and robots agree on the same sources of truth.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

// Canonical public origin. Falls back to an env var, then a localhost default.
// NEVER hardcode a production domain inside source files.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.FRONTEND_URL ||
  'http://localhost:3000'
).replace(/\/+$/, '');

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Yarnfit';

const SITE_TAGLINE =
  'Shop the latest collection of clothing and accessories.';

// Resolve a backend image name/path to an absolute URL. Relative paths are
// served from the backend's /uploads directory.
function absoluteImage(imageName) {
  if (!imageName) return undefined;
  if (imageName.startsWith('data:') || imageName.startsWith('blob:')) {
    return imageName;
  }
  if (/^https?:\/\//.test(imageName)) return imageName;
  if (imageName.startsWith('/')) return `${API_ORIGIN}${imageName}`;
  return `${API_ORIGIN}/uploads/${imageName}`;
}

export { API_URL, API_ORIGIN, SITE_URL, SITE_NAME, SITE_TAGLINE, absoluteImage };
