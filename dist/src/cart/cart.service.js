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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const CartItem_entity_1 = require("../../entity/CartItem.entity");
const typeorm_2 = require("typeorm");
const User_entity_1 = require("../../entity/User.entity");
let CartService = class CartService {
    cartRepository;
    userRepository;
    constructor(cartRepository, userRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }
    async getCartByUser(token) {
        const user = await this.userRepository.findOne({ where: { accessToken: token } });
        if (!user)
            throw new common_1.UnauthorizedException('Пользователь не найден');
        return this.cartRepository.find({
            where: { user: { id: user.id } },
            relations: ['product'],
        });
    }
    async clearCart(token) {
        const user = await this.userRepository.findOne({ where: { accessToken: token } });
        if (!user)
            throw new common_1.UnauthorizedException();
        await this.cartRepository.delete({ user: { id: user.id } });
    }
    async addToCart(token, productId, quantity = 1) {
        const user = await this.userRepository.findOne({ where: { accessToken: token } });
        if (!user)
            throw new common_1.UnauthorizedException();
        let item = await this.cartRepository.findOne({ where: { user: { id: user.id }, product: { id: productId } } });
        if (item) {
            item.quantity += quantity;
        }
        else {
            item = this.cartRepository.create({ user, product: { id: productId }, quantity });
        }
        return this.cartRepository.save(item);
    }
    async removeFromCart(token, productId) {
        const user = await this.userRepository.findOne({
            where: { accessToken: token },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Пользователь не найден');
        const item = await this.cartRepository.findOne({
            where: {
                user: { id: user.id },
                product: { id: productId },
            },
        });
        if (!item) {
            return { message: 'Товар не найден в корзине' };
        }
        await this.cartRepository.remove(item);
        return { message: 'Товар удалён из корзины' };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(CartItem_entity_1.CartItem)),
    __param(1, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map