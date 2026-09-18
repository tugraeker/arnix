/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // ⭐ BU SATIR ZORUNLU!
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
}
module.exports = nextConfig