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
var AuthScene_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthScene = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../auth/auth.service");
const telegraf_1 = require("telegraf");
let AuthScene = AuthScene_1 = class AuthScene {
    authService;
    logger = new common_1.Logger(AuthScene_1.name);
    userState = new Map();
    userTokens = new Map();
    constructor(authService) {
        this.authService = authService;
    }
    register(bot) {
        bot.action('REGISTER', async (ctx) => {
            await ctx.answerCbQuery();
            this.logger.log(`🆕 Registration started: ${ctx.from.id}`);
            this.userState.set(ctx.from.id, { step: 'WAIT_EMAIL' });
            await ctx.reply('📧 Введите email:');
        });
        bot.action('LOGIN', async (ctx) => {
            ctx.answerCbQuery();
            this.logger.log(`🔑 Login started: ${ctx.from.id}`);
            this.userState.set(ctx.from.id, { step: 'LOGIN_EMAIL' });
            await ctx.reply('📧 Введите email:');
        });
        bot.on('text', async (ctx) => {
            const state = this.userState.get(ctx.from.id);
            if (!state)
                return;
            const text = ctx.message.text;
            if (state.step === 'WAIT_EMAIL') {
                state.email = text;
                state.step = 'WAIT_PASSWORD';
                return ctx.reply('🔑 Введите пароль:');
            }
            if (state.step === 'WAIT_PASSWORD') {
                const { email } = state;
                const password = text;
                this.logger.log(`➡️ Registering ${email}`);
                try {
                    await this.authService.register('User', email, password);
                    this.logger.log(`✅ Registration done for ${ctx.from.id}`);
                }
                catch (error) {
                    this.logger.warn(`⛔ Registration failed: ${error.message}`);
                    this.userState.delete(ctx.from.id);
                    return ctx.reply(`❌ Ошибка регистрации: ${error.message}`, telegraf_1.Markup.inlineKeyboard([[telegraf_1.Markup.button.callback('⬅️ Назад', 'BACK')]]));
                }
                this.userState.delete(ctx.from.id);
                return ctx.reply('✅ Вы успешно зарегистрированы!', telegraf_1.Markup.inlineKeyboard([[telegraf_1.Markup.button.callback('⬅️ Назад', 'BACK')]]));
            }
            if (state.step === 'LOGIN_EMAIL') {
                state.email = text;
                state.step = 'LOGIN_PASSWORD';
                return ctx.reply('🔑 Введите пароль:');
            }
            if (state.step === 'LOGIN_PASSWORD') {
                const { email } = state;
                const password = text;
                this.logger.log(`➡️ Logging in ${email}`);
                try {
                    const user = await this.authService.validateUser(email, password);
                    const tokenObj = await this.authService.login(user, ctx.from.id);
                    const token = tokenObj.access_token;
                    this.userTokens.set(ctx.from.id, token);
                    this.logger.log(`✅ Login success for ${ctx.from.id}, token: ${token}`);
                    this.userState.delete(ctx.from.id);
                    return ctx.reply(`✅ Вы успешно вошли!\n\nВаш токен:\n${token}`, telegraf_1.Markup.inlineKeyboard([[telegraf_1.Markup.button.callback('⬅️ Назад', 'BACK')]]));
                }
                catch (error) {
                    this.logger.warn(`⛔ Login failed for ${ctx.from.id}: ${error.message}`);
                    this.userState.delete(ctx.from.id);
                    return ctx.reply(`❌ Ошибка входа: ${error.message}`, telegraf_1.Markup.inlineKeyboard([[telegraf_1.Markup.button.callback('⬅️ Назад', 'BACK')]]));
                }
            }
        });
        bot.action('BACK', async (ctx) => {
            ctx.answerCbQuery();
            this.userState.delete(ctx.from.id);
            await ctx.reply('⬅️ Главное меню', telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('📦 Каталог', 'CATALOG')],
                [telegraf_1.Markup.button.callback('🛒 Моя корзина', 'CART')],
                [telegraf_1.Markup.button.callback('🎟 Промокод', 'PROMO')],
                [telegraf_1.Markup.button.callback('❓ Помощь', 'HELP')],
                [telegraf_1.Markup.button.callback('🆕 Регистрация', 'REGISTER')],
                [telegraf_1.Markup.button.callback('🔑 Вход', 'LOGIN')],
            ]));
        });
    }
    getToken(telegramId) {
        return this.userTokens.get(telegramId) || null;
    }
};
exports.AuthScene = AuthScene;
exports.AuthScene = AuthScene = AuthScene_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthScene);
//# sourceMappingURL=auth.scene.js.map