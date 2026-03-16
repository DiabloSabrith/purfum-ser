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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const payment_service_1 = require("../payment/payment.service");
const Product_entity_1 = require("../../entity/Product.entity");
const User_entity_1 = require("../../entity/User.entity");
let OrderController = class OrderController {
    orderService;
    paymentService;
    constructor(orderService, paymentService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
    }
    async getAllOrders() {
        return this.orderService.getAllOrders();
    }
    async createOrderWithPayment(body) {
        if (!body.items || body.items.length === 0) {
            throw new Error('Корзина пуста');
        }
        const firstItem = body.items[0];
        const productEntity = await this.orderService['orderRepo'].manager.findOne(Product_entity_1.Product, {
            where: { id: firstItem.productId },
        });
        if (!productEntity)
            throw new Error('Товар не найден');
        let userEntity;
        if (body.userId) {
            userEntity = (await this.orderService['orderRepo'].manager.findOne(User_entity_1.User, {
                where: { id: body.userId },
            })) ?? undefined;
            if (!userEntity)
                throw new Error('Пользователь не найден');
        }
        const order = await this.orderService.createOrderWithEntities({
            telegramId: body.telegramId,
            userId: body.userId,
            name: body.name,
            city: body.city,
            delivery: body.delivery,
            quantity: body.items.reduce((sum, i) => sum + i.quantity, 0),
            product: productEntity,
            user: userEntity,
        });
        let totalAmount = 0;
        for (const item of body.items) {
            const product = await this.orderService['orderRepo'].manager.findOne(Product_entity_1.Product, {
                where: { id: item.productId },
            });
            if (!product)
                throw new Error(`Товар ${item.productId} не найден`);
            const price = Number(product.price);
            if (!Number.isFinite(price) || price <= 0)
                throw new Error(`Некорректная цена товара ${product.id}`);
            if (!Number.isFinite(item.quantity) || item.quantity <= 0)
                throw new Error(`Некорректное количество товара ${product.id}`);
            totalAmount += price * item.quantity;
        }
        if (!Number.isFinite(totalAmount) || totalAmount < 1)
            throw new Error(`Некорректная сумма платежа: ${totalAmount}`);
        const paymentAmount = {
            value: totalAmount.toFixed(2),
            currency: 'RUB',
        };
        const payment = await this.paymentService.createPayment(paymentAmount, `Оплата заказа №${order.id}`);
        return {
            orderId: order.id,
            paymentUrl: payment.confirmation.confirmation_url,
        };
    }
    async getUserOrdersByUserId(userId) {
        return this.orderService.getOrdersByUserId(userId);
    }
    async getUserOrdersByTelegramId(telegramId) {
        return this.orderService.getOrdersByTelegramId(telegramId);
    }
    async cancelOrder(id) {
        await this.orderService.updateStatus(id, 'Отменен');
        return { message: 'Заказ отменён' };
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Post)('create-with-payment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrderWithPayment", null);
__decorate([
    (0, common_1.Get)('user/byUserId/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getUserOrdersByUserId", null);
__decorate([
    (0, common_1.Get)('user/byTelegramId/:telegramId'),
    __param(0, (0, common_1.Param)('telegramId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getUserOrdersByTelegramId", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrder", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        payment_service_1.PaymentService])
], OrderController);
//# sourceMappingURL=order.controller.js.map