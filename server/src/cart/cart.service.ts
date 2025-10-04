import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Cart, CartItem } from "@prisma/client";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { ProductsService } from "../products/products.service";
import { CartStatus } from "@prisma/client";

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: any;
  })[];
};

type Identity = { userId?: string | null; token?: string | null };

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async getOrCreateCart(
    opts: Identity,
  ): Promise<{ cart: Cart; createdNew: boolean }> {
    const { userId, token } = opts ?? {};

    if (token) {
      const existingByToken = await this.prisma.cart.findFirst({
        where: { token, status: CartStatus.ACTIVE },
        include: {
          items: { include: { product: { include: { mainImage: true } } } },
        },
      });

      if (existingByToken) {
        // Если пользователь авторизован и корзина не привязана — привяжем
        if (userId && !existingByToken.userId) {
          try {
            await this.prisma.cart.update({
              where: { id: existingByToken.id },
              data: { userId },
            });
            existingByToken.userId = userId;
          } catch (e) {
            this.logger.error(
              "[cartService.getOrCreateCart] failed to attach cart",
              e,
            );
          }
        }

        return { cart: existingByToken, createdNew: false };
      }
    }

    // 2) если есть userId — пробуем его активную корзину
    if (userId) {
      const existingByUser = await this.prisma.cart.findFirst({
        where: { userId, status: CartStatus.ACTIVE },
        include: {
          items: { include: { product: { include: { mainImage: true } } } },
        },
      });
      if (existingByUser) {
        this.logger.log("[cartService.getOrCreateCart] found cart by userId", {
          id: existingByUser.id,
        });
        return { cart: existingByUser, createdNew: false };
      }
    }
    const newToken = token ?? ""; // genCartToken() — ваша функция генерации token
    const newCart = await this.prisma.cart.create({
      data: {
        userId: userId ?? null,
        token: newToken,
        status: CartStatus.ACTIVE,
      },
      include: {
        items: { include: { product: { include: { mainImage: true } } } },
      },
    });

    return { cart: newCart, createdNew: true };
  }

  async getCartWithItems(where: {
    id?: number;
    token?: string;
    userId?: string;
  }): Promise<CartWithItems | null> {
    const cart = await this.prisma.cart.findFirst({
      where: { ...where, status: CartStatus.ACTIVE },
      include: {
        items: {
          include: {
            product: { include: { mainImage: true } },
          },
        },
      },
    });

    // Сериализуем в plain object — часто помогает если Prisma возвращает прокси
    const plainCart = cart ? JSON.parse(JSON.stringify(cart)) : null;

    return plainCart as any;
  }

  async addToCartByIdentity(
    identity: Identity,
    dto: AddToCartDto,
  ): Promise<CartWithItems> {
    const { productId, quantity } = dto;

    const product = await this.productsService.findOne(productId);
    if (!product) throw new NotFoundException("Товар не найден");
    if (product.stock < quantity)
      throw new BadRequestException("Недостаточно товара на складе");

    const { cart } = await this.getOrCreateCart(identity);

    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty)
        throw new BadRequestException("Недостаточно товара на складе");
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return (await this.getCartWithItems({ id: cart.id }))!;
  }

  async removeFromCartByIdentity(
    identity: Identity,
    productId: number,
  ): Promise<CartWithItems> {
    const { cart } = await this.getOrCreateCart(identity);
    const row = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });
    if (!row) throw new NotFoundException("Товар не найден в корзине");
    await this.prisma.cartItem.delete({ where: { id: row.id } });
    return (await this.getCartWithItems({ id: cart.id }))!;
  }
  async clearCartByIdentity(identity: Identity): Promise<void> {
    const { cart } = await this.getOrCreateCart(identity);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  async calculateTotalByIdentity(identity: {
    userId?: string;
    token?: string;
  }): Promise<number> {
    const { cart } = await this.getOrCreateCart(identity);
    const full = await this.getCartWithItems({ id: cart.id });
    if (!full) return 0;
    return full.items.reduce(
      (s, it) => s + Number(it.product.price) * it.quantity,
      0,
    );
  }

  async mergeGuestIntoUser(
    guestToken: string,
    userId: string,
  ): Promise<CartWithItems> {
    const guest = await this.prisma.cart.findFirst({
      where: { token: guestToken, status: CartStatus.ACTIVE },
      include: { items: true },
    });
    const { cart: userCart } = await this.getOrCreateCart({ userId });

    if (guest && guest.id !== userCart.id) {
      for (const it of guest.items) {
        await this.prisma.cartItem.upsert({
          where: {
            cartId_productId: { cartId: userCart.id, productId: it.productId },
          },
          update: { quantity: { increment: it.quantity } },
          create: {
            cartId: userCart.id,
            productId: it.productId,
            quantity: it.quantity,
          },
        });
      }
      await this.prisma.cart.update({
        where: { id: guest.id },
        data: { status: CartStatus.MERGED },
      });
    }
    return (await this.getCartWithItems({ id: userCart.id }))!;
  }
}
