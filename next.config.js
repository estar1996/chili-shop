/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@radix-ui/react-checkbox',
    '@radix-ui/react-label',
    '@radix-ui/react-slot',
    '@radix-ui/react-form'
  ],
};

module.exports = nextConfig; 