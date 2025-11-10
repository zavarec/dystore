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
  Req,
  Res,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../common/guards/optional-jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { User } from "@prisma/client";
import { CART_COOKIE, CART_COOKIE_OPTS } from "src/constants/cart.constant";

@ApiTags("Cart")
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: "Get cart (guest or user)" })
  @ApiResponse({ status: 200 })
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getCart(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @CurrentUser() user?: User,
  ) {
    const token = req.cookies?.[CART_COOKIE] as string | undefined;
    const identity = { userId: user?.id, token };

    const { cart, createdNew } =
      await this.cartService.getOrCreateCart(identity);
    if (!token || createdNew)
      res.cookie(CART_COOKIE, cart.token, CART_COOKIE_OPTS);

    return this.cartService.getCartWithItems({ id: cart.id });
  }

  @ApiOperation({ summary: "Add item (guest or user)" })
  @ApiResponse({ status: 200 })
  @Post("add")
  @UseGuards(OptionalJwtAuthGuard)
  async addToCart(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @CurrentUser() user: User | undefined,
    @Body() dto: AddToCartDto,
  ) {
    try {
      const token: string | undefined = req.cookies?.[CART_COOKIE];
      const { cart, createdNew } = await this.cartService.getOrCreateCart({
        userId: user?.id,
        token,
      });

      if (!token || createdNew)
        res.cookie(CART_COOKIE, cart.token, CART_COOKIE_OPTS);
      return this.cartService.addToCartByIdentity(
        { userId: user?.id, token: cart.token },
        dto,
      );
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(
        "Ошибка при добавлении товара в корзину",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: "Set item quantity (guest or user)" })
  @ApiResponse({ status: 200 })
  @Post("set-quantity")
  @UseGuards(OptionalJwtAuthGuard)
  async setQuantity(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @CurrentUser() user: User | undefined,
    @Body() dto: AddToCartDto,
  ) {
    try {
      const token: string | undefined = req.cookies?.[CART_COOKIE];
      const { cart, createdNew } = await this.cartService.getOrCreateCart({
        userId: user?.id,
        token,
      });

      if (!token || createdNew)
        res.cookie(CART_COOKIE, cart.token, CART_COOKIE_OPTS);

      return this.cartService.setCartItemQuantityByIdentity(
        { userId: user?.id, token: cart.token },
        dto,
      );
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(
        "Ошибка при обновлении количества товара",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: "Remove item (guest or user)" })
  @ApiResponse({ status: 200 })
  @Delete("remove/:productId")
  @UseGuards(OptionalJwtAuthGuard)
  async removeFromCart(
    @Req() req: any,
    @CurrentUser() user: User | undefined,
    @Param("productId", ParseIntPipe) productId: number,
  ) {
    const token: string | undefined = req.cookies?.[CART_COOKIE];
    return this.cartService.removeFromCartByIdentity(
      { userId: user?.id, token },
      productId,
    );
  }

  // total можно без авторизации
  @ApiOperation({ summary: "Get cart total (guest or user)" })
  @UseGuards(OptionalJwtAuthGuard)
  @Get("total")
  async getCartTotal(@Req() req: any, @CurrentUser() user?: User) {
    const token: string | undefined = req.cookies?.[CART_COOKIE];
    const total = await this.cartService.calculateTotalByIdentity({
      userId: user?.id,
      token,
    });
    return { total };
  }

  // Мерджим после логина
  @ApiOperation({ summary: "Merge guest cart into user cart after login" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("merge-on-login")
  async mergeOnLogin(@Req() req: any, @CurrentUser() user: User) {
    const token: string | undefined = req.cookies?.[CART_COOKIE];
    if (!token) return this.getCart(req, undefined, user);
    return this.cartService.mergeGuestIntoUser(token, user.id);
  }
}
