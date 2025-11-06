export interface OrderItemDTO {
  productId: string;
  name: string;
  sku?: string;
  quantity: number;
  price: number; // за единицу
}

export interface CustomerDTO {
  name?: string;
  email?: string;
  phone?: string; // +7..., +31...
}

export interface OrderDTO {
  orderId: string; // человекочитаемый номер (orderNumber)
  total: number;
  items: OrderItemDTO[];
  customer: CustomerDTO;
  comment?: string;
  deliveryAddress?: string;
  deliveryMethod?: string;
  source?: string; // website | chat-widget и т.п.
}
