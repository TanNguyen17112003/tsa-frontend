/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NODE_ENV == 'staging' ? 'export' : undefined,
  images: {
    unoptimized: process.env.NODE_ENV == 'staging' ? true : false,
  }
};

export default nextConfig;
