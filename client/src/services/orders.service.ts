import type { CreateOrderRequest, Order } from '@/types/models/order.model';

import { apiClient } from './api';

export class OrdersService {
  // Создать заказ (требует авторизации)
  static async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>('/order', data);
    return response.data;
  }

  // Получить историю заказов (требует авторизации)
  static async getOrderHistory(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/order/history');
    return response.data;
  }

  // Получить детали заказа (требует авторизации)
  static async getOrderById(id: number): Promise<Order> {
    const response = await apiClient.get<Order>(`/order/${id}`);
    return response.data;
  }
}

export default OrdersService;
