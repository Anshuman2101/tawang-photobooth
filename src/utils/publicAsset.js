// Files in /public are served as-is and must be referenced by URL, not import.
// This helper keeps that URL correct whether the app is served from a domain
// root or a GitHub Pages subfolder (vite.config.js sets base: './').
export function publicAsset(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
