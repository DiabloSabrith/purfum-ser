"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotModule = void 0;
const common_1 = require("@nestjs/common");
const bot_service_1 = require("./bot.service");
const config_1 = require("@nestjs/config");
const user_module_1 = require("../user/user.module");
const product_module_1 = require("../product/product.module");
const cart_module_1 = require("../cart/cart.module");
const promo_module_1 = require("../promo/promo.module");
const auth_scene_1 = require("./scenes/auth.scene");
const catalog_scene_1 = require("./scenes/catalog.scene");
const cart_scene_1 = require("./scenes/cart.scene");
const promo_scene_1 = require("./scenes/promo.scene");
const auth_guard_1 = require("./guards/auth.guard");
const help_scene_1 = require("./scenes/help.scene");
const auth_module_1 = require("../auth/auth.module");
const order_scene_1 = require("./scenes/order.scene");
const order_module_1 = require("../order/order.module");
const myorder_scene_1 = require("./scenes/myorder.scene");
let BotModule = class BotModule {
};
exports.BotModule = BotModule;
exports.BotModule = BotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            product_module_1.ProductModule,
            cart_module_1.CartModule,
            promo_module_1.PromoModule,
            order_module_1.OrderModule,
        ],
        providers: [
            bot_service_1.BotService,
            auth_scene_1.AuthScene,
            catalog_scene_1.CatalogScene,
            cart_scene_1.CartScene,
            promo_scene_1.PromoScene,
            help_scene_1.HelpScene,
            order_scene_1.OrderScene,
            myorder_scene_1.MyOrdersScene,
            auth_guard_1.TgAuthGuard,
        ],
    })
], BotModule);
//# sourceMappingURL=bot.module.js.map