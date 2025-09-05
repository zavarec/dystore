import { apiClient } from './api';
import { Cart, CartTotal, AddToCartRequest } from '@/types/models/cart.model';

class CartService {
  // Получить корзину (гость или пользователь)
  static async getCart(): Promise<Cart> {
    const { data } = await apiClient.get<Cart>('/cart');
    return data;
  }

  // Добавить товар (гость или пользователь)
  static async addToCart(data: AddToCartRequest): Promise<Cart> {
    const { data: res } = await apiClient.post<Cart>('/cart/add', data);
    return res;
  }

  // Удалить товар (гость или пользователь)
  static async removeFromCart(productId: number): Promise<Cart> {
    const { data } = await apiClient.delete<Cart>(`/cart/remove/${productId}`);
    return data;
  }

  static async getCartTotal(): Promise<CartTotal> {
    const { data } = await apiClient.get<CartTotal>('/cart/total');
    return data;
  }

  // Быстрее и безопаснее — отдельная ручка очистки на бэке (по желанию)
  static async clearCart(): Promise<void> {
    const cart = await this.getCart();
    await Promise.all(cart.items.map(i => this.removeFromCart(i.productId)));
  }
}

export default CartService;
