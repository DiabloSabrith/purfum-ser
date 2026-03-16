"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cart_service_1 = require("./cart.service");
const cart_controller_1 = require("./cart.controller");
const CartItem_entity_1 = require("../../entity/CartItem.entity");
const User_entity_1 = require("../../entity/User.entity");
const cart_scene_1 = require("../bot/scenes/cart.scene");
const auth_module_1 = require("../auth/auth.module");
const order_scene_1 = require("../bot/scenes/order.scene");
const order_module_1 = require("../order/order.module");
let CartModule = class CartModule {
};
exports.CartModule = CartModule;
exports.CartModule = CartModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([CartItem_entity_1.CartItem, User_entity_1.User]),
            auth_module_1.AuthModule,
            order_module_1.OrderModule,
        ],
        providers: [cart_service_1.CartService, cart_scene_1.CartScene, order_scene_1.OrderScene],
        controllers: [cart_controller_1.CartController],
        exports: [cart_service_1.CartService],
    })
], CartModule);
//# sourceMappingURL=cart.module.js.map