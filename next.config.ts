import type {NextConfig} from 'next';

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: isProd ? '/outloox.github.io' : '',
  assetPrefix: isProd ? '/outloox.github.io/' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.telegram.org',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
