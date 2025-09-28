import type { CreateProductDto, UpdateProductDto, Product } from '@/types/models/product.model';

import { apiClient } from './api';

export class ProductsService {
  // Получить все продукты
  static async getAllProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  }

  // Получить продукт по ID
  static async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/id/${id}`);
    return response.data;
  }

  // Получить продукты по категории
  static async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`/products/category/${categoryId}`);
    return response.data;
  }

  // Получить продукты по категории с подкатегориями
  static async getProductsByCategoryIncludingDescendants(categoryId: number): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `/products/category/${categoryId}/with-descendants`,
    );
    return response.data;
  }

  // Создать продукт (требует авторизации)
  static async createProduct(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  }

  // Обновить продукт (требует авторизации)
  static async updateProduct(id: number, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  }

  // Удалить продукт (требует авторизации)
  static async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  }
}

export default ProductsService;
