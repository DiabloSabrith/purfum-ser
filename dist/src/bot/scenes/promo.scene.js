"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PromoScene_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoScene = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const userState = new Map();
let PromoScene = PromoScene_1 = class PromoScene {
    logger = new common_1.Logger(PromoScene_1.name);
    register(bot) {
        bot.action('PROMO', async (ctx) => {
            await ctx.answerCbQuery();
            this.logger.log(`🎟 Promo clicked by ${ctx.from.id}`);
            const isAuth = false;
            if (!isAuth) {
                return ctx.reply('❗ Чтобы использовать промокод, нужно войти', telegraf_1.Markup.inlineKeyboard([
                    [telegraf_1.Markup.button.callback('🆕 Регистрация', 'REGISTER')],
                    [telegraf_1.Markup.button.callback('🔑 Вход', 'LOGIN')],
                ]));
            }
            userState.set(ctx.from.id, { step: 'WAIT_PROMO' });
            await ctx.reply('🎟 Введите промокод:');
        });
        bot.on('text', async (ctx) => {
            const state = userState.get(ctx.from.id);
            if (!state || state.step !== 'WAIT_PROMO')
                return;
            const promo = ctx.message.text;
            this.logger.log(`🎟 Promo received: ${promo} from ${ctx.from.id}`);
            userState.delete(ctx.from.id);
            await ctx.reply(`✅ Промокод "${promo}" применён (заглушка)`);
        });
    }
};
exports.PromoScene = PromoScene;
exports.PromoScene = PromoScene = PromoScene_1 = __decorate([
    (0, common_1.Injectable)()
], PromoScene);
//# sourceMappingURL=promo.scene.js.map