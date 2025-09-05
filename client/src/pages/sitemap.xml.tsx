import type { GetServerSideProps } from 'next';
import { ProductsService, CategoriesService } from '@/services';
import type { Product } from '@/types/models/product.model';
import type { Category } from '@/types/models/category.model';

function SiteMap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const [products, categories] = await Promise.all([
      ProductsService.getAllProducts(),
      CategoriesService.getAllCategories(),
    ] as [Promise<Product[]>, Promise<Category[]>]);

    const nowIso = new Date().toISOString();

    const categoryUrls = (categories || [])
      .map(
        category => `
        <url>
          <loc>https://dyson-group.ru/category/${category.slug}</loc>
          <lastmod>${nowIso}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `,
      )
      .join('');

    const productUrls = (products || [])
      .map(
        product => `
        <url>
          <loc>https://dyson-group.ru/product/${product.slug}</loc>
          <lastmod>${(product as any)?.updatedAt || nowIso}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>
      `,
      )
      .join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static pages -->
      <url>
        <loc>https://dyson-group.ru</loc>
        <lastmod>${nowIso}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://dyson-group.ru/about</loc>
        <lastmod>${nowIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
      <url>
        <loc>https://dyson-group.ru/contacts</loc>
        <lastmod>${nowIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>

      <!-- Category pages -->
      ${categoryUrls}

      <!-- Product pages -->
      ${productUrls}
    </urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  } catch (error) {
    // В случае ошибки не ломаем страницу: возвращаем пустой sitemap со статикой
    const nowIso = new Date().toISOString();
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://dyson-group.ru</loc>
        <lastmod>${nowIso}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
    </urlset>`;
    res.setHeader('Content-Type', 'text/xml');
    res.write(fallback);
    res.end();
  }

  return { props: {} };
};

export default SiteMap;
