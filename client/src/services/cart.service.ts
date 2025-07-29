import { apiClient } from './api';
import { Cart, CartTotal, AddToCartRequest } from '@/types/models/cart.model';

export class CartService {
  // Получить корзину (требует авторизации)
  static async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>('/cart');
    return response.data;
  }

  // Добавить товар в корзину (требует авторизации)
  static async addToCart(data: AddToCartRequest): Promise<Cart> {
    const response = await apiClient.post<Cart>('/cart/add', data);
    return response.data;
  }

  // Удалить товар из корзины (требует авторизации)
  static async removeFromCart(productId: number): Promise<Cart> {
    const response = await apiClient.delete<Cart>(`/cart/remove/${productId}`);
    return response.data;
  }

  // Получить общую стоимость корзины (требует авторизации)
  static async getCartTotal(): Promise<CartTotal> {
    const response = await apiClient.get<CartTotal>('/cart/total');
    return response.data;
  }

  // Очистить корзину (вспомогательный метод)
  static async clearCart(): Promise<void> {
    const cart = await this.getCart();
    // Удаляем каждый товар по отдельности
    for (const item of cart.items) {
      await this.removeFromCart(item.productId);
    }
  }
}

export default CartService;
