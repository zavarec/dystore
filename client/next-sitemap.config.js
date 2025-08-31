/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: false, // У нас уже есть кастомный robots.txt
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,

  // Исключаем ненужные страницы
  exclude: ['/admin/*', '/api/*', '/_next/*', '/404', '/500'],

  // Дополнительные пути
  additionalPaths: async config => {
    const result = [];

    // Добавляем статические страницы с высоким приоритетом
    result.push({
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    });

    // Добавляем категории
    const categories = [
      'vacuum-cleaners',
      'hair-care',
      'air-purifiers',
      'lighting',
      'fans',
      'accessories',
    ];

    categories.forEach(category => {
      result.push({
        loc: `/category/${category}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
    });

    return result;
  },

  // Трансформация URL для мультиязычности
  transform: async (config, path) => {
    // Дефолтные настройки для всех страниц
    const defaultTransform = {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };

    // Особые настройки для разных типов страниц
    if (path === '/') {
      return {
        ...defaultTransform,
        priority: 1.0,
        changefreq: 'daily',
      };
    }

    if (path.startsWith('/product/')) {
      return {
        ...defaultTransform,
        priority: 0.9,
        changefreq: 'weekly',
      };
    }

    if (path.startsWith('/category/')) {
      return {
        ...defaultTransform,
        priority: 0.8,
        changefreq: 'weekly',
      };
    }

    return defaultTransform;
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/_next'],
      },
    ],
  },
};
