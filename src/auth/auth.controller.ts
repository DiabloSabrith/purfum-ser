import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    return this.authService.register(body.name, body.email, body.password);
  }

// login
@Post('login')
async login(@Body() body: { email: string; password: string; telegramId?: number }) {
  const user = await this.authService.validateUser(body.email, body.password);

  // Только если реально идёт логин через Telegram
  const telegramId = body.telegramId;
  return this.authService.login(user, telegramId);
}


  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user; // текущий пользователь
  }
}
