import { 
  Controller, 
  Get, 
  Req, 
  UseGuards, 
  UnauthorizedException, 
  Post, 
  Body, 
  Delete, 
  Param 
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ===== Получение корзины текущего пользователя =====
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@Req() req) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();

    return this.cartService.getCartByUser(token);
  }

  // ===== Добавление товара =====
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addToCart(@Req() req, @Body() body: { productId: number; quantity: number }) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();

    return this.cartService.addToCart(token, body.productId, body.quantity);
  }

  // ===== Очистка корзины =====
  @UseGuards(JwtAuthGuard)
  @Post('clear')
  async clearCart(@Req() req) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();

    return this.cartService.clearCart(token);
  }

  // ===== Удаление одного товара =====
  @UseGuards(JwtAuthGuard)
  @Delete('remove/:productId')
  async removeFromCart(@Req() req, @Param('productId') productId: number) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();

    return this.cartService.removeFromCart(token, Number(productId));
  }
}
