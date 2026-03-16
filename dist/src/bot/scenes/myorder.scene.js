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
var MyOrdersScene_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyOrdersScene = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../../order/order.service");
let MyOrdersScene = MyOrdersScene_1 = class MyOrdersScene {
    orderService;
    logger = new common_1.Logger(MyOrdersScene_1.name);
    constructor(orderService) {
        this.orderService = orderService;
    }
    async showOrders(ctx) {
        const telegramId = ctx.from.id;
        let orders;
        try {
            orders = await this.orderService.getOrdersByTelegramId(telegramId, ['product']);
        }
        catch (err) {
            console.error(err);
            return ctx.reply('❌ Не удалось загрузить ваши заказы. Попробуйте позже.');
        }
        if (!orders.length) {
            return ctx.reply('📦 У вас пока нет заказов.');
        }
        for (const order of orders) {
            const statusEmoji = order.status === 'CREATED' ? '📝 Оформлен' :
                order.status === 'IN_PROGRESS' ? '🚚 В пути' :
                    '✅ Доставлен';
            const productName = order.product?.name ?? 'Без названия';
            const productPrice = order.product?.price !== undefined ? `${order.product.price} ₽` : '—';
            const productImage = order.product?.imageUrl ?? order.productImage;
            const caption = `📌 Заказ #${order.id}\n` +
                `📛 Имя: ${order.name}\n` +
                `🏙 Город: ${order.city}\n` +
                `🚚 Доставка: ${order.delivery}\n` +
                `📦 Товар: ${productName}\n` +
                `💰 Цена: ${productPrice}\n` +
                `📌 Статус: ${statusEmoji}\n` +
                `🕒 Создан: ${order.createdAt.toLocaleString()}`;
            try {
                if (productImage) {
                    await ctx.replyWithPhoto(productImage, { caption });
                }
                else {
                    await ctx.reply(caption);
                }
            }
            catch (err) {
                console.error(`Ошибка при отправке заказа #${order.id}:`, err);
                await ctx.reply(caption);
            }
        }
    }
};
exports.MyOrdersScene = MyOrdersScene;
exports.MyOrdersScene = MyOrdersScene = MyOrdersScene_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], MyOrdersScene);
//# sourceMappingURL=myorder.scene.js.map