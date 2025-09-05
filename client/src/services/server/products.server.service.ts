import { serverApiClient } from '../api.server';
import { Product } from '@/types/models/product.model';

export class ServerProductsService {
  static async getAllProducts(): Promise<Product[]> {
    const { data } = await serverApiClient.get<Product[]>('/products');
    return data;
  }

  static async getProductById(id: number): Promise<Product> {
    const { data } = await serverApiClient.get<Product>(`/products/id/${String(id)}`);
    return data;
  }

  static async getProductBySlug(slug: string): Promise<Product> {
    // ПОД API КОНТРОЛЛЕР: /products/slug/:slug
    const { data } = await serverApiClient.get<Product>(
      `/products/slug/${encodeURIComponent(slug)}`,
    );
    return data;
  }
}

export default ServerProductsService;
