export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  priceAtPurchase: string;
  product: {
    id: number;
    name: string;
  };
}

export interface Order {
  id: number;
  userId: string;
  totalPrice: string;
  status: OrderStatus;
  deliveryAddress?: string;
  comment?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  deliveryAddress: string;
  comment?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}
