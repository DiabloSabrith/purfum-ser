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
var CatalogScene_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogScene = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const auth_service_1 = require("../../auth/auth.service");
const product_service_1 = require("../../product/product.service");
const cart_service_1 = require("../../cart/cart.service");
let CatalogScene = CatalogScene_1 = class CatalogScene {
    authService;
    productService;
    cartService;
    logger = new common_1.Logger(CatalogScene_1.name);
    constructor(authService, productService, cartService) {
        this.authService = authService;
        this.productService = productService;
        this.cartService = cartService;
    }
    register(bot) {
        bot.action(/CATALOG(_PAGE_\d+)?/, async (ctx) => {
            await ctx.answerCbQuery();
            const page = ctx.match?.[0]?.includes('PAGE')
                ? Number(ctx.match[0].split('_').pop())
                : 1;
            const limit = 5;
            const { items, page: cur, totalPages } = await this.productService.getProductsPaginated(page, limit);
            const buttons = items.map(p => [
                telegraf_1.Markup.button.callback(`${p.name} — ${p.price} ₽`, `PRODUCT_${p.id}`),
            ]);
            const navButtons = [
                ...(cur > 1 ? [telegraf_1.Markup.button.callback('◀️ Назад', `CATALOG_PAGE_${cur - 1}`)] : []),
                telegraf_1.Markup.button.callback(`${cur} / ${totalPages}`, 'IGNORE'),
                ...(cur < totalPages ? [telegraf_1.Markup.button.callback('▶️ Вперёд', `CATALOG_PAGE_${cur + 1}`)] : []),
            ];
            buttons.push(navButtons);
            buttons.push([telegraf_1.Markup.button.callback('⬅️ Главное меню', 'BACK')]);
            await ctx.reply(`📦 Каталог товаров (стр. ${cur} / ${totalPages})`, telegraf_1.Markup.inlineKeyboard(buttons));
        });
        bot.action(/PRODUCT_\d+/, async (ctx) => {
            await ctx.answerCbQuery();
            const productId = Number(ctx.match[0].split('_')[1]);
            this.logger.log(`🛍 Product clicked ${productId} by ${ctx.from.id}`);
            const product = await this.productService.getProductById(productId);
            const text = `
🛍 <b>${product.name}</b>

💰 Цена: <b>${product.price} ₽</b>
📦 В наличии: ${product.count}

📝 ${product.description || 'Описание отсутствует'}
      `;
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🛒 В корзину', `ADD_${product.id}`)],
                [telegraf_1.Markup.button.callback('⬅️ Назад в каталог', 'CATALOG')],
            ]);
            if (product.imageUrl) {
                return ctx.replyWithPhoto(product.imageUrl, {
                    caption: text,
                    parse_mode: 'HTML',
                    ...keyboard,
                });
            }
            return ctx.reply(text, { parse_mode: 'HTML', ...keyboard });
        });
        bot.action(/ADD_\d+/, async (ctx) => {
            await ctx.answerCbQuery();
            const productId = Number(ctx.match[0].split('_')[1]);
            const user = await this.authService.findByTelegramId(ctx.from.id);
            if (!user?.accessToken) {
                return ctx.reply('❗ Нужно войти, чтобы добавить товар в корзину');
            }
            await this.cartService.addToCart(user.accessToken, productId);
            return ctx.reply('✅ Товар добавлен в корзину', telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('⬅️ Назад в каталог', 'CATALOG')],
                [telegraf_1.Markup.button.callback('🛒 Перейти в корзину', 'CART')],
            ]));
        });
    }
};
exports.CatalogScene = CatalogScene;
exports.CatalogScene = CatalogScene = CatalogScene_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        product_service_1.ProductService,
        cart_service_1.CartService])
], CatalogScene);
//# sourceMappingURL=catalog.scene.js.map