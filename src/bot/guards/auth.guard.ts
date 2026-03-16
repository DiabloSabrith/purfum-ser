import { Injectable } from "@nestjs/common";

@Injectable()
export class TgAuthGuard {
  authService: any;
  async check(ctx): Promise<boolean> {
    return !!await this.authService.findByTelegramId(ctx.from.id);
  }
}
