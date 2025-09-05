import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Order, OrderStatus, OrderItem } from "@prisma/client";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CartService } from "../cart/cart.service";
import { TelegramService } from "../telegram/telegram.service";

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: any;
  })[];
  user?: any;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly telegramService: TelegramService,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderWithItems> {
    // Получаем корзину пользователя
    const cart = await this.cartService.getCartWithItems({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException("Корзина пуста");
    }

    // Вычисляем общую стоимость на основе актуальных цен
    let totalPrice = 0;
    const orderItems: Array<{
      productId: number;
      quantity: number;
      priceAtPurchase: number;
    }> = [];

    for (const cartItem of cart.items) {
      const currentPrice = Number(cartItem.product.price);
      const itemTotal = currentPrice * cartItem.quantity;
      totalPrice += itemTotal;

      // Проверяем наличие на складе
      if (cartItem.product.stock < cartItem.quantity) {
        throw new BadRequestException(
          `Недостаточно товара "${cartItem.product.name}" на складе. Доступно: ${cartItem.product.stock}`,
        );
      }

      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceAtPurchase: currentPrice,
      });
    }

    // Создаем заказ с элементами в одной транзакции
    const order = await this.prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: OrderStatus.PENDING,
        deliveryAddress: createOrderDto.deliveryAddress,
        comment: createOrderDto.comment,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    // Очищаем корзину
    await this.cartService.clearCartByIdentity({ userId });

    // Отправляем Telegram-уведомление (best-effort, не ломаем поток заказа)
    const lines: string[] = [];
    lines.push(`🛒 Новый заказ #${order.id}`);
    lines.push(`Статус: ${order.status}`);
    if (order.user?.name || order.user?.phone || order.user?.email) {
      const who = [order.user?.name, order.user?.phone, order.user?.email]
        .filter(Boolean)
        .join(" · ");
      lines.push(`Покупатель: ${who}`);
    }
    if (order.deliveryAddress) {
      lines.push(`Адрес: ${order.deliveryAddress}`);
    }
    if (order.comment) {
      lines.push(`Комментарий: ${order.comment}`);
    }
    lines.push("Товары:");
    for (const item of order.items) {
      const productName = item.product?.name ?? `#${item.productId}`;
      lines.push(
        `• ${productName} × ${item.quantity} = ${item.priceAtPurchase * item.quantity}`,
      );
    }
    lines.push(`Итого: ${order.totalPrice}`);

    const message = lines.join("\n");
    this.telegramService.sendMessage(message).catch(() => undefined);

    return order;
  }

  async findUserOrders(userId: string): Promise<OrderWithItems[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll(): Promise<OrderWithItems[]> {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number): Promise<OrderWithItems> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Заказ не найден");
    }

    return order;
  }

  async findUserOrder(
    userId: string,
    orderId: number,
  ): Promise<OrderWithItems> {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException("Заказ не найден");
    }

    return order;
  }

  async updateOrderStatus(
    id: number,
    status: OrderStatus,
  ): Promise<OrderWithItems> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }
}
