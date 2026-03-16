import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminBotGuard {
  // список админов по username без @
  private readonly adminUsernames = ['NazDevFront'];

  isAdmin(ctx: any): boolean {
    // ctx.from.username возвращает без @
    return ctx.from?.username && this.adminUsernames.includes(ctx.from.username);
  }
}
