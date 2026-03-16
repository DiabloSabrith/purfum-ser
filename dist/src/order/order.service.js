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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const Order_entity_1 = require("../../entity/Order.entity");
const Product_entity_1 = require("../../entity/Product.entity");
const User_entity_1 = require("../../entity/User.entity");
let OrderService = class OrderService {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async createOrderWithEntities(params) {
        const { telegramId, userId, name, city, delivery, quantity, product, user } = params;
        const orderData = {
            telegramId,
            userId,
            name,
            city,
            delivery,
            quantity,
            status: 'Оформлен',
            product,
            user: user ?? undefined,
        };
        const order = this.orderRepo.create(orderData);
        return this.orderRepo.save(order);
    }
    async createOrder(params) {
        const { telegramId, userId, name, city, delivery, productId, quantity } = params;
        const product = productId
            ? await this.orderRepo.manager.findOne(Product_entity_1.Product, { where: { id: productId } })
            : undefined;
        const user = userId
            ? await this.orderRepo.manager.findOne(User_entity_1.User, { where: { id: userId } })
            : undefined;
        const orderData = {
            telegramId,
            userId,
            name,
            city,
            delivery,
            status: 'Оформлен',
            quantity,
            product: product ?? undefined,
            user: user ?? undefined,
        };
        const order = this.orderRepo.create(orderData);
        return this.orderRepo.save(order);
    }
    async getOrdersByTelegramId(telegramId, relations = []) {
        return this.orderRepo.find({
            where: { telegramId },
            relations,
            order: { createdAt: 'DESC' },
        });
    }
    async getOrdersByUserId(userId, relations = []) {
        return this.orderRepo.find({
            where: { userId },
            relations,
            order: { createdAt: 'DESC' },
        });
    }
    async getAllOrders() {
        return this.orderRepo.find({
            relations: ['product', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateStatus(orderId, status) {
        return this.orderRepo.update(orderId, { status });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(Order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map