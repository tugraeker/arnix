/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/arnix',
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