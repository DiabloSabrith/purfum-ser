"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const product_module_1 = require("./product/product.module");
const user_module_1 = require("./user/user.module");
const payment_module_1 = require("./payment/payment.module");
const cart_module_1 = require("./cart/cart.module");
const order_module_1 = require("./order/order.module");
const promo_module_1 = require("./promo/promo.module");
const auth_module_1 = require("./auth/auth.module");
const User_entity_1 = require("../entity/User.entity");
const config_1 = require("@nestjs/config");
const bot_module_1 = require("./bot/bot.module");
const Product_entity_1 = require("../entity/Product.entity");
const CartItem_entity_1 = require("../entity/CartItem.entity");
const Order_entity_1 = require("../entity/Order.entity");
const admin_bot_module_1 = require("./admin-bot/admin-bot.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: '1708',
                database: 'tg_bot',
                entities: [User_entity_1.User, Product_entity_1.Product, CartItem_entity_1.CartItem, Order_entity_1.Order],
                synchronize: true,
                logging: false,
            }),
            user_module_1.UserModule,
            product_module_1.ProductModule,
            payment_module_1.PaymentModule,
            cart_module_1.CartModule,
            order_module_1.OrderModule,
            promo_module_1.PromoModule,
            auth_module_1.AuthModule,
            bot_module_1.BotModule,
            admin_bot_module_1.AdminBotModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map