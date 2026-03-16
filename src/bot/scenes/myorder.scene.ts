import { Injectable, Logger } from "@nestjs/common";
import { OrderService } from "src/order/order.service";

@Injectable()
export class MyOrdersScene {
  private readonly logger = new Logger(MyOrdersScene.name);

  constructor(private readonly orderService: OrderService) {}

  async showOrders(ctx: any) {
    const telegramId = ctx.from.id;

    let orders;
    try {
      // Подтягиваем связанные продукты (название, цена, картинка)
      orders = await this.orderService.getOrdersByTelegramId(telegramId, ['product']);
    } catch (err) {
      console.error(err);
      return ctx.reply('❌ Не удалось загрузить ваши заказы. Попробуйте позже.');
    }

    if (!orders.length) {
      return ctx.reply('📦 У вас пока нет заказов.');
    }

    // Проходим по каждому заказу
    for (const order of orders) {
      // Определяем эмодзи для статуса
      const statusEmoji =
        order.status === 'CREATED' ? '📝 Оформлен' :
        order.status === 'IN_PROGRESS' ? '🚚 В пути' :
        '✅ Доставлен';

      // Получаем информацию о продукте, если она есть
      const productName = order.product?.name ?? 'Без названия';
      const productPrice = order.product?.price !== undefined ? `${order.product.price} ₽` : '—';
      const productImage = order.product?.imageUrl ?? order.productImage;

      // Формируем красивую подпись
      const caption = `📌 Заказ #${order.id}\n` +
                      `📛 Имя: ${order.name}\n` +
                      `🏙 Город: ${order.city}\n` +
                      `🚚 Доставка: ${order.delivery}\n` +
                      `📦 Товар: ${productName}\n` +
                      `💰 Цена: ${productPrice}\n` +
                      `📌 Статус: ${statusEmoji}\n` +
                      `🕒 Создан: ${order.createdAt.toLocaleString()}`;

      try {
        // Если есть картинка — отправляем как фото с подписью
        if (productImage) {
          await ctx.replyWithPhoto(productImage, { caption });
        } else {
          await ctx.reply(caption);
        }
      } catch (err) {
        console.error(`Ошибка при отправке заказа #${order.id}:`, err);
        await ctx.reply(caption); // fallback: просто текст
      }
    }
  }
}
