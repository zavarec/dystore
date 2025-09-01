import { serverApiClient } from './api.server';
import { Product } from '@/types/models/product.model';

export class ServerProductsService {
  static async getAllProducts(): Promise<Product[]> {
    const { data } = await serverApiClient.get<Product[]>('/products');
    return data;
  }

  static async getProductById(id: number): Promise<Product> {
    const { data } = await serverApiClient.get<Product>(`/products/${id}`);
    return data;
  }
}

export default ServerProductsService;
