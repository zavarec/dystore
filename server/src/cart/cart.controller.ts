import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: User) {
    try {
      return await this.cartService.getCartWithItems(user.id);
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении корзины' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add')
  async addToCart(
    @CurrentUser() user: User,
    @Body(ValidationPipe) addToCartDto: AddToCartDto,
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

  @Get('total')
  async getCartTotal(@CurrentUser() user: User): Promise<{ total: number }> {
    try {
      const total = await this.cartService.calculateTotal(user.id);
      return { total };
    } catch (error) {
      throw new HttpException(
        'Ошибка при расчете суммы корзины' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
