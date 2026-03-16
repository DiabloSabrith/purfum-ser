import { Injectable, Logger } from '@nestjs/common';
import { Markup, Telegraf } from 'telegraf';

const userState = new Map<number, any>();

@Injectable()
export class PromoScene {
  private readonly logger = new Logger(PromoScene.name);

  register(bot: Telegraf) {
    bot.action('PROMO', async (ctx) => {
   await   ctx.answerCbQuery();
      this.logger.log(`🎟 Promo clicked by ${ctx.from.id}`);

      const isAuth = false; // заглушка авторизации
      if (!isAuth) {
        return ctx.reply('❗ Чтобы использовать промокод, нужно войти', Markup.inlineKeyboard([
          [Markup.button.callback('🆕 Регистрация', 'REGISTER')],
          [Markup.button.callback('🔑 Вход', 'LOGIN')],
        ]));
      }

      userState.set(ctx.from.id, { step: 'WAIT_PROMO' });
      await ctx.reply('🎟 Введите промокод:');
    });

    bot.on('text', async (ctx) => {
      const state = userState.get(ctx.from.id);
      if (!state || state.step !== 'WAIT_PROMO') return;

      const promo = ctx.message.text;
      this.logger.log(`🎟 Promo received: ${promo} from ${ctx.from.id}`);
      userState.delete(ctx.from.id);

      await ctx.reply(`✅ Промокод "${promo}" применён (заглушка)`);
    });
  }
}
