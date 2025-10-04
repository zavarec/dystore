import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductsModule } from '../products/products.module';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

@Module({
  imports: [ProductsModule],
  providers: [CartService, OptionalJwtAuthGuard],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
