import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Cart, CartItem } from '@prisma/client';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductsService } from '../products/products.service';

type CartWithItems = Cart & {
  items: (CartItem & {
    product: any;
  })[];
};

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async getOrCreateCart(userId: string): Promise<CartWithItems> {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartWithItems> {
    const { productId, quantity } = addToCartDto;

    // Проверяем существование товара
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    // Проверяем наличие на складе
    if (product.stock < quantity) {
      throw new BadRequestException('Недостаточно товара на складе');
    }

    const cart = await this.getOrCreateCart(userId);

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // Обновляем количество
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw new BadRequestException('Недостаточно товара на складе');
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Создаем новый элемент корзины
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCartWithItems(userId);
  }

  async getCartWithItems(userId: string): Promise<CartWithItems> {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return this.getOrCreateCart(userId);
    }

    return cart;
  }

  async removeFromCart(
    userId: string,
    productId: number,
  ): Promise<CartWithItems> {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар не найден в корзине');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return this.getCartWithItems(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  }

  async calculateTotal(userId: string): Promise<number> {
    const cart = await this.getCartWithItems(userId);

    return cart.items.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);
  }
}
