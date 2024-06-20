/** @type {import('next').NextConfig} */
require('dotenv').config({ path: './.env' });
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
};

module.exports = nextConfig;
