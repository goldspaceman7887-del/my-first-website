/** @type {import('next').NextConfig} */
// GH_PAGES_BASE_PATH is set only by the GitHub Pages deploy workflow, so local
// `npm run dev`/`npm run build` are unaffected and still serve from "/".
const basePath = process.env.GH_PAGES_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

module.exports = nextConfig;
