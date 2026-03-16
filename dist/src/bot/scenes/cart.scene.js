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
var CartScene_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartScene = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const auth_service_1 = require("../../auth/auth.service");
const cart_service_1 = require("../../cart/cart.service");
const order_scene_1 = require("./order.scene");
let CartScene = CartScene_1 = class CartScene {
    authService;
    cartService;
    orderScene;
    logger = new common_1.Logger(CartScene_1.name);
    constructor(authService, cartService, orderScene) {
        this.authService = authService;
        this.cartService = cartService;
        this.orderScene = orderScene;
    }
    register(bot) {
        bot.action('CART_ORDER', async (ctx) => {
            await ctx.answerCbQuery();
            const token = await this.authService.getToken(ctx.from.id);
            if (!token) {
                return ctx.reply('❗ Для оформления заказа нужно войти', telegraf_1.Markup.inlineKeyboard([
                    [telegraf_1.Markup.button.callback('🆕 Регистрация', 'REGISTER')],
                    [telegraf_1.Markup.button.callback('🔑 Вход', 'LOGIN')],
                ]));
            }
            await this.orderScene.startOrder(ctx);
        });
        bot.action('CART', async (ctx) => {
            await ctx.answerCbQuery();
            this.logger.log(`🛒 Cart clicked by ${ctx.from.id}`);
            const token = await this.authService.getToken(ctx.from.id);
            if (!token) {
                return ctx.reply('❗ Для доступа к корзине нужно войти', telegraf_1.Markup.inlineKeyboard([
                    [telegraf_1.Markup.button.callback('🆕 Регистрация', 'REGISTER')],
                    [telegraf_1.Markup.button.callback('🔑 Вход', 'LOGIN')],
                ]));
            }
            const items = await this.cartService.getCartByUser(token);
            if (!items.length)
                return ctx.reply('🛒 Ваша корзина пуста');
            for (const item of items) {
                const caption = `
📌 ${item.product.name}
💰 Цена: ${item.product.price} ₽
🛒 Кол-во: ${item.quantity}
        `;
                if (item.product.imageUrl) {
                    await ctx.replyWithPhoto(item.product.imageUrl, { caption, parse_mode: 'HTML' });
                }
                else {
                    await ctx.reply(caption, { parse_mode: 'HTML' });
                }
            }
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🗑 Очистить корзину', 'CART_CLEAR')],
                [telegraf_1.Markup.button.callback('✅ Оформить заказ', 'CART_ORDER')],
                [telegraf_1.Markup.button.callback('⬅️ Назад в каталог', 'CATALOG')],
            ]);
            await ctx.reply('Вы можете управлять корзиной ниже:', keyboard);
        });
        bot.action('CART_CLEAR', async (ctx) => {
            await ctx.answerCbQuery();
            const token = await this.authService.getToken(ctx.from.id);
            if (!token)
                return ctx.reply('❗ Нужно войти, чтобы очистить корзину');
            await this.cartService.clearCart(token);
            return ctx.reply('✅ Корзина очищена');
        });
    }
};
exports.CartScene = CartScene;
exports.CartScene = CartScene = CartScene_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        cart_service_1.CartService,
        order_scene_1.OrderScene])
], CartScene);
//# sourceMappingURL=cart.scene.js.map