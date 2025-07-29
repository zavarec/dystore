import { Product } from './product.model';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: string;
  createdAt: string;
  items: CartItem[];
}

export interface CartTotal {
  total: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}
