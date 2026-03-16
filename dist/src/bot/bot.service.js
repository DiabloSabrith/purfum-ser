"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const telegraf_1 = require("telegraf");
const catalog_scene_1 = require("./scenes/catalog.scene");
const promo_scene_1 = require("./scenes/promo.scene");
const cart_scene_1 = require("./scenes/cart.scene");
const help_scene_1 = require("./scenes/help.scene");
const auth_scene_1 = require("./scenes/auth.scene");
const order_scene_1 = require("./scenes/order.scene");
const myorder_scene_1 = require("./scenes/myorder.scene");
let BotService = BotService_1 = class BotService {
    configService;
    authScene;
    catalogScene;
    cartScene;
    promoScene;
    helpScene;
    orderScene;
    myOrdersScene;
    bot;
    logger = new common_1.Logger(BotService_1.name);
    constructor(configService, authScene, catalogScene, cartScene, promoScene, helpScene, orderScene, myOrdersScene) {
        this.configService = configService;
        this.authScene = authScene;
        this.catalogScene = catalogScene;
        this.cartScene = cartScene;
        this.promoScene = promoScene;
        this.helpScene = helpScene;
        this.orderScene = orderScene;
        this.myOrdersScene = myOrdersScene;
    }
    async onModuleInit() {
        const token = this.configService.get('TELEGRAM_BOT_TOKEN');
        if (!token || process.env.NODE_ENV !== 'production') {
            this.logger.log('🟡 Telegram bot disabled (dev mode or token missing)');
            return;
        }
        this.logger.log('✅ Telegram token loaded');
        this.bot = new telegraf_1.Telegraf(token);
        const mainMenu = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('📦 Каталог', 'CATALOG')],
            [telegraf_1.Markup.button.callback('🛒 Моя корзина', 'CART')],
            [telegraf_1.Markup.button.callback('📋 Мои заказы', 'MY_ORDERS')],
            [telegraf_1.Markup.button.callback('🎟 Промокод', 'PROMO')],
            [telegraf_1.Markup.button.callback('❓ Помощь', 'HELP')],
        ]);
        this.bot.start((ctx) => {
            this.logger.log(`/start from ${ctx.from.id}`);
            ctx.reply(`👋 Добро пожаловать в магазин Парфюм*Распив!\n\nВыберите действие:`, mainMenu);
        });
        this.bot.action('MY_ORDERS', async (ctx) => {
            await ctx.answerCbQuery('Загружаем ваши заказы...');
            try {
                await this.myOrdersScene.showOrders(ctx);
            }
            catch (err) {
                console.error(err);
                await ctx.reply('❌ Ошибка при загрузке заказов.');
            }
        });
        this.orderScene.register(this.bot);
        this.authScene.register(this.bot);
        this.catalogScene.register(this.bot);
        this.cartScene.register(this.bot);
        this.promoScene.register(this.bot);
        this.helpScene.register(this.bot);
        await this.bot.launch();
        this.logger.log('🚀 Telegram bot started');
    }
};
exports.BotService = BotService;
exports.BotService = BotService = BotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_scene_1.AuthScene,
        catalog_scene_1.CatalogScene,
        cart_scene_1.CartScene,
        promo_scene_1.PromoScene,
        help_scene_1.HelpScene,
        order_scene_1.OrderScene,
        myorder_scene_1.MyOrdersScene])
], BotService);
//# sourceMappingURL=bot.service.js.map