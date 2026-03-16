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
var OrderScene_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderScene = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const order_service_1 = require("../../order/order.service");
let OrderScene = OrderScene_1 = class OrderScene {
    orderService;
    logger = new common_1.Logger(OrderScene_1.name);
    userState = new Map();
    constructor(orderService) {
        this.orderService = orderService;
    }
    async startOrder(ctx, product) {
        const userId = ctx.from.id;
        this.userState.set(userId, { step: 'NAME', productId: product?.id });
        this.logger.log(`🟢 Order started by ${userId}`);
        await ctx.reply('📛 Введите ваше имя:');
    }
    register(bot) {
        bot.use(async (ctx, next) => {
            if (!ctx.from)
                return next();
            const userId = ctx.from.id;
            const state = this.userState.get(userId);
            if (!state)
                return next();
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
                    await ctx.reply('🚚 Выберите способ доставки:', telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback('🚕 Яндекс Доставка', 'ORDER_DELIVERY_YANDEX')],
                        [telegraf_1.Markup.button.callback('📦 СДЭК', 'ORDER_DELIVERY_CDEK')],
                        [telegraf_1.Markup.button.callback('🏪 5Post', 'ORDER_DELIVERY_5POST')],
                        [telegraf_1.Markup.button.callback('📮 Почта РФ', 'ORDER_DELIVERY_RUS')],
                    ]));
                    return;
                }
            }
            if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
                const data = ctx.callbackQuery.data;
                if (data.startsWith('ORDER_DELIVERY_')) {
                    await ctx.answerCbQuery();
                    const deliveryCode = data.replace('ORDER_DELIVERY_', '');
                    const deliveryMap = {
                        YANDEX: 'Яндекс Доставка',
                        CDEK: 'СДЭК',
                        RUS: 'Почта РФ',
                        '5POST': '5Post',
                    };
                    state.delivery = deliveryMap[deliveryCode] ?? deliveryCode;
                    state.step = 'PAYMENT';
                    this.logger.log(`📦 Delivery selected: ${state.delivery} by ${userId}`);
                    await ctx.reply(`📌 Ваш заказ:\n` +
                        `📛 Имя: ${state.name}\n` +
                        `🏙 Город: ${state.city}\n` +
                        `🚚 Доставка: ${state.delivery}\n\n` +
                        `Нажмите кнопку ниже, чтобы оплатить:`, telegraf_1.Markup.inlineKeyboard([[telegraf_1.Markup.button.callback('💳 Оплатить', 'ORDER_PAY')]]));
                    return;
                }
                if (data === 'ORDER_PAY') {
                    await ctx.answerCbQuery();
                    await this.orderService.createOrder({
                        userId,
                        name: state.name,
                        city: state.city,
                        delivery: state.delivery,
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
};
exports.OrderScene = OrderScene;
exports.OrderScene = OrderScene = OrderScene_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderScene);
//# sourceMappingURL=order.scene.js.map