// src/cart/cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'User cart with items' })
  @Get()
  async getCart(@CurrentUser() user: User) {
    try {
      return await this.cartService.getCartWithItems(user.id);
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении корзины',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 200, description: 'Item added to cart' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('add')
  async addToCart(
    @CurrentUser() user: User,
    @Body() addToCartDto: AddToCartDto,
  ) {
    try {
      return await this.cartService.addToCart(user.id, addToCartDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при добавлении товара в корзину',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @Delete('remove/:productId')
  async removeFromCart(
    @CurrentUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    try {
      return await this.cartService.removeFromCart(user.id, productId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при удалении товара из корзины',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Get cart total' })
  @ApiResponse({ status: 200, description: 'Cart total amount' })
  @Get('total')
  async getCartTotal(@CurrentUser() user: User): Promise<{ total: number }> {
    try {
      const total = await this.cartService.calculateTotal(user.id);
      return { total };
    } catch (error) {
      throw new HttpException(
        'Ошибка при расчете суммы корзины',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}