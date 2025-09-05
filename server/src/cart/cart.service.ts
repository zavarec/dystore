import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Cart, CartItem } from "@prisma/client";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { ProductsService } from "../products/products.service";
import { CartStatus } from "@prisma/client";

type CartWithItems = Cart & {
  items: (CartItem & {
    product: any;
  })[];
};

type Identity = { userId?: string | null; token?: string | null };

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async getOrCreateCart(
    opts: Identity,
  ): Promise<{ cart: Cart; createdNew: boolean }> {
    const { userId, token } = opts ?? {};

    // 1) если есть userId — пробуем его активную корзину
    if (userId) {
      const userCart = await this.prisma.cart.findFirst({
        where: { userId: userId, status: CartStatus.ACTIVE },
      });
      if (userCart) return { cart: userCart, createdNew: false };
    }
    // 2) если есть токен гостя — вернуть
    if (token) {
      const guestCart = await this.prisma.cart.findFirst({
        where: { token: token, status: CartStatus.ACTIVE },
      });
      if (guestCart) return { cart: guestCart, createdNew: false };
    }
    // 3) иначе создать новую (гостевую или юзерскую)
    const newCart = await this.prisma.cart.create({
      data: { userId: userId ?? null }, // token сгенерируется автоматически
    });
    return { cart: newCart, createdNew: true };
  }

  async getCartWithItems(where: {
    id?: number;
    token?: string;
    userId?: string;
  }): Promise<CartWithItems | null> {
    return this.prisma.cart.findFirst({
      where: { ...where, status: CartStatus.ACTIVE },
      include: { items: { include: { product: true } } },
    }) as any;
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
