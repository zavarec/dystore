module.exports = {
  i18n: {
    defaultLocale: 'ru',
    locales: ['en', 'ru'],
    localeDetection: false,
  },
  fallbackLng: {
    default: ['ru'],
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',

  // Настройки для SEO
  interpolation: {
    escapeValue: false,
  },

  // Оптимизация загрузки переводов
  // ns: ['common', 'products', 'categories', 'seo'],
  ns: ['common'],
  defaultNS: 'common',
};
