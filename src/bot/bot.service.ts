/* import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Markup, Telegraf } from "telegraf";
import { CatalogScene } from "./scenes/catalog.scene";
import { PromoScene } from "./scenes/promo.scene";
import { CartScene } from "./scenes/cart.scene";
import { HelpScene } from "./scenes/help.scene";
import { AuthScene } from "./scenes/auth.scene";
import { OrderScene } from "./scenes/order.scene";
import { MyOrdersScene } from "./scenes/myorder.scene";

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(BotService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authScene: AuthScene,
    private readonly catalogScene: CatalogScene,
    private readonly cartScene: CartScene,
    private readonly promoScene: PromoScene,
    private readonly helpScene: HelpScene,
    private readonly orderScene: OrderScene,
    private readonly myOrdersScene: MyOrdersScene,
  ) {}

  async onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) throw new Error('❌ TELEGRAM_BOT_TOKEN not found');

    this.logger.log('✅ Telegram token loaded');
    this.bot = new Telegraf(token);

    // ===== Главное меню (всегда одно и то же) =====
    const mainMenu = Markup.inlineKeyboard([
      [Markup.button.callback('📦 Каталог', 'CATALOG')],
      [Markup.button.callback('🛒 Моя корзина', 'CART')],
      [Markup.button.callback('📋 Мои заказы', 'MY_ORDERS')],
      [Markup.button.callback('🎟 Промокод', 'PROMO')],
      [Markup.button.callback('❓ Помощь', 'HELP')],
    ]);

    this.bot.start((ctx) => {
      this.logger.log(`/start from ${ctx.from.id}`);
      ctx.reply(
        `👋 Добро пожаловать в магазин Парфюм*Распив!\n\nВыберите действие:`,
        mainMenu
      );
    });

    // ===== Обработчики кнопок =====
 this.bot.action('MY_ORDERS', async (ctx) => {
  // отвечаем сразу
  await ctx.answerCbQuery('Загружаем ваши заказы...');

  // потом показываем заказы
  try {
    await this.myOrdersScene.showOrders(ctx);
  } catch (err) {
    console.error(err);
    await ctx.reply('❌ Ошибка при загрузке заказов.');
  }
});


    // подключаем остальные сцены
    this.orderScene.register(this.bot);
    this.authScene.register(this.bot);
    this.catalogScene.register(this.bot);
    this.cartScene.register(this.bot);
    this.promoScene.register(this.bot);
    this.helpScene.register(this.bot);

    await this.bot.launch();
    this.logger.log('🚀 Telegram bot started');
  }
}
 */
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Markup, Telegraf } from "telegraf";
import { CatalogScene } from "./scenes/catalog.scene";
import { PromoScene } from "./scenes/promo.scene";
import { CartScene } from "./scenes/cart.scene";
import { HelpScene } from "./scenes/help.scene";
import { AuthScene } from "./scenes/auth.scene";
import { OrderScene } from "./scenes/order.scene";
import { MyOrdersScene } from "./scenes/myorder.scene";

@Injectable()
export class BotService implements OnModuleInit {
  private bot?: Telegraf;
  private readonly logger = new Logger(BotService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authScene: AuthScene,
    private readonly catalogScene: CatalogScene,
    private readonly cartScene: CartScene,
    private readonly promoScene: PromoScene,
    private readonly helpScene: HelpScene,
    private readonly orderScene: OrderScene,
    private readonly myOrdersScene: MyOrdersScene,
  ) {}

  async onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    // Если токена нет или мы в деве — не запускаем бот
    if (!token || process.env.NODE_ENV !== 'production') {
      this.logger.log('🟡 Telegram bot disabled (dev mode or token missing)');
      return;
    }

    this.logger.log('✅ Telegram token loaded');
    this.bot = new Telegraf(token);

    // ===== Главное меню (всегда одно и то же) =====
    const mainMenu = Markup.inlineKeyboard([
      [Markup.button.callback('📦 Каталог', 'CATALOG')],
      [Markup.button.callback('🛒 Моя корзина', 'CART')],
      [Markup.button.callback('📋 Мои заказы', 'MY_ORDERS')],
      [Markup.button.callback('🎟 Промокод', 'PROMO')],
      [Markup.button.callback('❓ Помощь', 'HELP')],
    ]);

    this.bot.start((ctx) => {
      this.logger.log(`/start from ${ctx.from.id}`);
      ctx.reply(
        `👋 Добро пожаловать в магазин Парфюм*Распив!\n\nВыберите действие:`,
        mainMenu
      );
    });

    // ===== Обработчики кнопок =====
    this.bot.action('MY_ORDERS', async (ctx) => {
      await ctx.answerCbQuery('Загружаем ваши заказы...');
      try {
        await this.myOrdersScene.showOrders(ctx);
      } catch (err) {
        console.error(err);
        await ctx.reply('❌ Ошибка при загрузке заказов.');
      }
    });

    // подключаем остальные сцены
    this.orderScene.register(this.bot);
    this.authScene.register(this.bot);
    this.catalogScene.register(this.bot);
    this.cartScene.register(this.bot);
    this.promoScene.register(this.bot);
    this.helpScene.register(this.bot);

    await this.bot.launch();
    this.logger.log('🚀 Telegram bot started');
  }
}
