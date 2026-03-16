"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBotModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const admin_bot_service_1 = require("./admin-bot.service");
const admin_bot_update_1 = require("./admin-bot.update");
const admin_bot_guard_1 = require("./admin-bot.guard");
const product_api_1 = require("./api/product.api");
const order_module_1 = require("../order/order.module");
let AdminBotModule = class AdminBotModule {
};
exports.AdminBotModule = AdminBotModule;
exports.AdminBotModule = AdminBotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            axios_1.HttpModule,
            order_module_1.OrderModule
        ],
        providers: [
            admin_bot_service_1.AdminBotService,
            admin_bot_update_1.AdminBotUpdate,
            admin_bot_guard_1.AdminBotGuard,
            product_api_1.ProductApi,
        ],
    })
], AdminBotModule);
//# sourceMappingURL=admin-bot.module.js.map