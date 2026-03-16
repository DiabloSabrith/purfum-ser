import { Injectable, Logger } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { AuthService } from 'src/auth/auth.service';
import { ProductService } from 'src/product/product.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class CatalogScene {
  private readonly logger = new Logger(CatalogScene.name);

  constructor(
    private readonly authService: AuthService,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
  ) {}

  register(bot: Telegraf) {
    // ==== Каталог с пагинацией ====
    bot.action(/CATALOG(_PAGE_\d+)?/, async (ctx) => {
      await ctx.answerCbQuery();

      const page = ctx.match?.[0]?.includes('PAGE')
        ? Number(ctx.match[0].split('_').pop())
        : 1;

      const limit = 5; // товаров на странице

      // Получаем товары без токена
      const { items, page: cur, totalPages } =
        await this.productService.getProductsPaginated(page, limit);

      // Кнопки для товаров (каждая в отдельной строке)
      const buttons = items.map(p => [
        Markup.button.callback(`${p.name} — ${p.price} ₽`, `PRODUCT_${p.id}`),
      ]);

      // Навигационные кнопки
      const navButtons = [
        ...(cur > 1 ? [Markup.button.callback('◀️ Назад', `CATALOG_PAGE_${cur - 1}`)] : []),
        Markup.button.callback(`${cur} / ${totalPages}`, 'IGNORE'),
        ...(cur < totalPages ? [Markup.button.callback('▶️ Вперёд', `CATALOG_PAGE_${cur + 1}`)] : []),
      ];
      buttons.push(navButtons);

      // Кнопка главное меню
      buttons.push([Markup.button.callback('⬅️ Главное меню', 'BACK')]);

      // Отправляем клавиатуру
      await ctx.reply(
        `📦 Каталог товаров (стр. ${cur} / ${totalPages})`,
        Markup.inlineKeyboard(buttons),
      );
    });

    // ==== Просмотр карточки товара ====
    bot.action(/PRODUCT_\d+/, async (ctx) => {
      await ctx.answerCbQuery();

      const productId = Number(ctx.match[0].split('_')[1]);
      this.logger.log(`🛍 Product clicked ${productId} by ${ctx.from.id}`);

      // Получаем данные о товаре без токена
      const product = await this.productService.getProductById(productId);

      // Формируем текст карточки товара
      const text = `
🛍 <b>${product.name}</b>

💰 Цена: <b>${product.price} ₽</b>
📦 В наличии: ${product.count}

📝 ${product.description || 'Описание отсутствует'}
      `;

      // Кнопки
      const keyboard = Markup.inlineKeyboard([
        // Добавление в корзину — только если пользователь авторизован
        [Markup.button.callback('🛒 В корзину', `ADD_${product.id}`)],
        [Markup.button.callback('⬅️ Назад в каталог', 'CATALOG')],
      ]);

      // Отправляем фото, если есть
      if (product.imageUrl) {
        return ctx.replyWithPhoto(product.imageUrl, {
          caption: text,
          parse_mode: 'HTML',
          ...keyboard,
        });
      }

      // Если фото нет — просто текст
      return ctx.reply(text, { parse_mode: 'HTML', ...keyboard });
    });

    // ==== Добавление в корзину ====
    bot.action(/ADD_\d+/, async (ctx) => {
      await ctx.answerCbQuery();

      const productId = Number(ctx.match[0].split('_')[1]);

      // Получаем пользователя через Telegram ID
      const user = await this.authService.findByTelegramId(ctx.from.id);
      if (!user?.accessToken) {
        return ctx.reply('❗ Нужно войти, чтобы добавить товар в корзину');
      }

      // Добавляем товар в корзину
      await this.cartService.addToCart(user.accessToken, productId);

      return ctx.reply('✅ Товар добавлен в корзину', Markup.inlineKeyboard([
        [Markup.button.callback('⬅️ Назад в каталог', 'CATALOG')],
        [Markup.button.callback('🛒 Перейти в корзину', 'CART')],
      ]));
    });
  }
}
