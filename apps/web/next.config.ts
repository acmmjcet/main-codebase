import { composePlugins, withNx } from '@nx/next';
import type { NextConfig } from 'next';
import path from 'path';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@acm/api-endpoints'],
  experimental: {
    externalDir: true,
  },
  nx: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@acm/api-endpoints': path.resolve(__dirname, '../../packages/api-endpoints/src'),
    };
    return config;
  },
};

const plugins = [withNx];
const composed = composePlugins(...plugins)(nextConfig);

initOpenNextCloudflareForDev();

export default composed;
