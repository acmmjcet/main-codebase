import { composePlugins, withNx } from '@nx/next';
import type { NextConfig } from 'next';
import path from 'path';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com"]
  },

  reactStrictMode: true,

  /** ⬇️ IMPORTANT: Add your package here */
  transpilePackages: ['@acm/api-endpoints', '@acm/portfolio-components'],

  experimental: {
    externalDir: true,
  },
  nx: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@acm/api-endpoints': path.resolve(
        __dirname,
        '../../packages/api-endpoints/src'
      ),

      '@acm/portfolio-components': path.resolve(
        __dirname,
        '../../packages/portfolio-components/src'
      ),
    };

    return config;
  },
};

const plugins = [withNx];
const composed = composePlugins(...plugins)(nextConfig);

initOpenNextCloudflareForDev();

export default composed;
