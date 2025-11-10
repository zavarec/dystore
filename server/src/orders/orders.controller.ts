// src/orders/orders.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorators/role.decorator";
import { Role } from "@prisma/client";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { User } from "@prisma/client";
import { CART_COOKIE } from "src/constants/cart.constant";

@ApiTags("Orders")
@Controller("order")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: "Create new order" })
  @ApiResponse({ status: 201, description: "Order created successfully" })
  @ApiResponse({ status: 400, description: "Cart is empty or invalid data" })
  @Post()
  async createOrder(
    @Req() req: any,
    @CurrentUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    try {
      const cartToken = req.cookies?.[CART_COOKIE] as string | undefined;
      const cart = await this.ordersService.createOrder(
        user.id,
        createOrderDto,
        cartToken,
      );
      return cart;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Ошибка при создании заказа",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: "Get user order history" })
  @ApiResponse({ status: 200, description: "List of user orders" })
  @Get("history")
  async getOrderHistory(@CurrentUser() user: User) {
    try {
      return await this.ordersService.findUserOrders(user.id);
    } catch (error) {
      throw new HttpException(
        "Ошибка при получении истории заказов",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: "Get order by ID" })
  @ApiResponse({ status: 200, description: "Order details" })
  @ApiResponse({ status: 404, description: "Order not found" })
  @Get(":id")
  async getOrder(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number,
  ) {
    try {
      return await this.ordersService.findUserOrder(user.id, id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Ошибка при получении заказа",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: "Get all orders (manager/director)" })
  @ApiResponse({ status: 200, description: "All orders" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.DIRECTOR)
  @Get()
  async getAllOrders() {
    try {
      return await this.ordersService.findAll();
    } catch (error) {
      throw new HttpException(
        "Ошибка при получении заказов",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
