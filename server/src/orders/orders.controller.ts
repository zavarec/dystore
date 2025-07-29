import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @CurrentUser() user: User,
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ) {
    try {
      return await this.ordersService.createOrder(user.id, createOrderDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при создании заказа',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('history')
  async getOrderHistory(@CurrentUser() user: User) {
    try {
      return await this.ordersService.findUserOrders(user.id);
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении истории заказов',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getOrder(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      return await this.ordersService.findUserOrder(user.id, id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при получении заказа',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
