import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class HelpScene {
  private readonly logger = new Logger(HelpScene.name);

  register(bot: Telegraf) {
    bot.action('HELP', async (ctx) => {
      ctx.answerCbQuery();
      this.logger.log(`❓ Help clicked by ${ctx.from.id}`);
      await ctx.reply('❓ Поддержка: @your_support');
    });
  }
}
