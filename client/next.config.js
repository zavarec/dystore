/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,

  // Разрешаем сборку даже при ESLint/TS ошибках (MVP)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Оптимизация изображений - потому что качественные фото пылесосов важны!
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 год
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Разрешенные домены для изображений
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dyson-h.assetsadobe2.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'dyson-h.assetsadobe2.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Компрессия и оптимизация
  compress: true,
  poweredByHeader: false,

  // Экспериментальные фиксы для лучшей производительности
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    optimizePackageImports: ['@phosphor-icons/react'],
  },

  // Настройки для production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack конфигурация для анализа бандла
  webpack: (config, { dev, isServer }) => {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        }),
      );
    }

    return config;
  },
};

module.exports = nextConfig;
