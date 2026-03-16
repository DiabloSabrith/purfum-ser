import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { AuthService } from 'src/auth/auth.service';
import { CartService } from 'src/cart/cart.service';
import { OrderScene } from './order.scene'; // <-- подключаем

@Injectable()
export class CartScene {
  private readonly logger = new Logger(CartScene.name);

  constructor(
    private readonly authService: AuthService,
    private readonly cartService: CartService,
  
    private readonly orderScene: OrderScene, // <-- через DI
  ) {}

  register(bot: Telegraf) {
    // ===== Новый обработчик: Оформить заказ =====
    bot.action('CART_ORDER', async (ctx) => {
      await ctx.answerCbQuery();

      const token = await this.authService.getToken(ctx.from.id);
      if (!token) {
        return ctx.reply(
          '❗ Для оформления заказа нужно войти',
          Markup.inlineKeyboard([
            [Markup.button.callback('🆕 Регистрация', 'REGISTER')],
            [Markup.button.callback('🔑 Вход', 'LOGIN')],
          ]),
        );
      }

      // ✅ Прямой вызов OrderScene
      await this.orderScene.startOrder(ctx);
    });

    // ===== Остальные кнопки CART =====
    bot.action('CART', async (ctx) => {
      await ctx.answerCbQuery();
      this.logger.log(`🛒 Cart clicked by ${ctx.from.id}`);

      const token = await this.authService.getToken(ctx.from.id);
      if (!token) {
        return ctx.reply(
          '❗ Для доступа к корзине нужно войти',
          Markup.inlineKeyboard([
            [Markup.button.callback('🆕 Регистрация', 'REGISTER')],
            [Markup.button.callback('🔑 Вход', 'LOGIN')],
          ]),
        );
      }

      const items = await this.cartService.getCartByUser(token);
      if (!items.length) return ctx.reply('🛒 Ваша корзина пуста');

      for (const item of items) {
        const caption = `
📌 ${item.product.name}
💰 Цена: ${item.product.price} ₽
🛒 Кол-во: ${item.quantity}
        `;
        if (item.product.imageUrl) {
          await ctx.replyWithPhoto(item.product.imageUrl, { caption, parse_mode: 'HTML' });
        } else {
          await ctx.reply(caption, { parse_mode: 'HTML' });
        }
      }

      const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🗑 Очистить корзину', 'CART_CLEAR')],
        [Markup.button.callback('✅ Оформить заказ', 'CART_ORDER')],
        [Markup.button.callback('⬅️ Назад в каталог', 'CATALOG')],
      ]);

      await ctx.reply('Вы можете управлять корзиной ниже:', keyboard);
    });

    bot.action('CART_CLEAR', async (ctx) => {
      await ctx.answerCbQuery();
      const token = await this.authService.getToken(ctx.from.id);
      if (!token) return ctx.reply('❗ Нужно войти, чтобы очистить корзину');

      await this.cartService.clearCart(token);
      return ctx.reply('✅ Корзина очищена');
    });
  }
}
