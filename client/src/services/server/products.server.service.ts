import type { Product } from '@/types/models/product.model';

import { serverApiClient } from '../api.server';

export class ServerProductsService {
  static async getAllProducts(): Promise<Product[]> {
    const { data } = await serverApiClient.get<Product[]>('/products');
    return data;
  }

  static async getProductById(id: number): Promise<Product> {
    console.log(id, 'getProductById id');

    const { data } = await serverApiClient.get<Product>(`/products/${String(id)}`);

    console.log(data, 'getProductById data');

    return data;
  }

  static async getProductBySlug(slug: string): Promise<Product> {
    console.log(slug, 'getProductBySlug slug');
    // ПОД API КОНТРОЛЛЕР: /products/slug/:slug
    const { data } = await serverApiClient.get<Product>(
      `/products/slug/${encodeURIComponent(slug)}`,
    );

    console.log(data, 'getProductBySlug data');
    return data;
  }
}

export default ServerProductsService;
