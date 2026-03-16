import { Injectable, Logger } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { OrderService } from 'src/order/order.service';
import { Product } from 'entity/Product.entity';

interface OrderState {
  step: 'NAME' | 'CITY' | 'DELIVERY' | 'PAYMENT';
  name?: string;
  city?: string;
  delivery?: string;
  productId?: number; // теперь хранится только ID продукта
  quantity?: number; 
}

@Injectable()
export class OrderScene {
  private readonly logger = new Logger(OrderScene.name);
  private userState = new Map<number, OrderState>();

  constructor(private readonly orderService: OrderService) {}

  // Старт оформления заказа
  async startOrder(ctx: any, product?: Product) {
    const userId = ctx.from.id;
    this.userState.set(userId, { step: 'NAME', productId: product?.id });
    this.logger.log(`🟢 Order started by ${userId}`);
    await ctx.reply('📛 Введите ваше имя:');
  }

  register(bot: Telegraf) {
    bot.use(async (ctx, next) => {
      if (!ctx.from) return next();
      const userId = ctx.from.id;
      const state = this.userState.get(userId);
      if (!state) return next();

      // ---------- ТЕКСТ ----------
      if (ctx.message && 'text' in ctx.message) {
        const text = ctx.message.text.trim();

        if (state.step === 'NAME') {
          state.name = text;
          state.step = 'CITY';
          await ctx.reply('🏙 Введите ваш город:');
          return;
        }

        if (state.step === 'CITY') {
          state.city = text;
          state.step = 'DELIVERY';
          await ctx.reply(
            '🚚 Выберите способ доставки:',
            Markup.inlineKeyboard([
              [Markup.button.callback('🚕 Яндекс Доставка', 'ORDER_DELIVERY_YANDEX')],
              [Markup.button.callback('📦 СДЭК', 'ORDER_DELIVERY_CDEK')],
              [Markup.button.callback('🏪 5Post', 'ORDER_DELIVERY_5POST')],
              [Markup.button.callback('📮 Почта РФ', 'ORDER_DELIVERY_RUS')],
            ])
          );
          return;
        }
      }

      // ---------- КНОПКИ ----------
      if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
        const data = ctx.callbackQuery.data;

        if (data.startsWith('ORDER_DELIVERY_')) {
          await ctx.answerCbQuery();
          const deliveryCode = data.replace('ORDER_DELIVERY_', '');
          const deliveryMap: Record<string, string> = {
            YANDEX: 'Яндекс Доставка',
            CDEK: 'СДЭК',
            RUS: 'Почта РФ',
            '5POST': '5Post',
          };
          state.delivery = deliveryMap[deliveryCode] ?? deliveryCode;
          state.step = 'PAYMENT';

          this.logger.log(`📦 Delivery selected: ${state.delivery} by ${userId}`);

          await ctx.reply(
            `📌 Ваш заказ:\n` +
              `📛 Имя: ${state.name}\n` +
              `🏙 Город: ${state.city}\n` +
              `🚚 Доставка: ${state.delivery}\n\n` +
              `Нажмите кнопку ниже, чтобы оплатить:`,
            Markup.inlineKeyboard([[Markup.button.callback('💳 Оплатить', 'ORDER_PAY')]])
          );
          return;
        }

        if (data === 'ORDER_PAY') {
          await ctx.answerCbQuery();

          // ✅ Сохраняем заказ в БД с новым createOrder (объект)
          await this.orderService.createOrder({
            userId,               // для бота используем userId (или telegramId если хочешь)
            name: state.name!,
            city: state.city!,
            delivery: state.delivery!,
            productId: state.productId,
          quantity: state.quantity ?? 1

          });

          await ctx.reply('✅ Оплата завершена. Ваш заказ считается оформленным!');

          this.logger.log(`💰 Order payment mock for ${userId}`);

          this.userState.delete(userId);
          return;
        }
      }

      return next();
    });
  }
}
