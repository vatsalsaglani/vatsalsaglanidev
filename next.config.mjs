/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the same build deploys to Cloudflare Pages and GitHub Pages.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
