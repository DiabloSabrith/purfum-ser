// auth.scene.ts
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Markup, Telegraf } from 'telegraf';

@Injectable()
export class AuthScene {
  private readonly logger = new Logger(AuthScene.name);
  private userState = new Map<number, any>(); // состояние пользователя в FSM
  private userTokens = new Map<number, string>(); // хранение JWT после логина

  constructor(private readonly authService: AuthService) {}

  register(bot: Telegraf) {
    // ====== РЕГИСТРАЦИЯ ======
    bot.action('REGISTER', async (ctx) => {
      await ctx.answerCbQuery();
      this.logger.log(`🆕 Registration started: ${ctx.from.id}`);
      this.userState.set(ctx.from.id, { step: 'WAIT_EMAIL' });
      await ctx.reply('📧 Введите email:');
    });

    // ====== ВХОД ======
    bot.action('LOGIN', async (ctx) => {
      ctx.answerCbQuery();
      this.logger.log(`🔑 Login started: ${ctx.from.id}`);
      this.userState.set(ctx.from.id, { step: 'LOGIN_EMAIL' });
      await ctx.reply('📧 Введите email:');
    });

    // ====== ОБРАБОТКА ТЕКСТА ======
    bot.on('text', async (ctx) => {
      const state = this.userState.get(ctx.from.id);
      if (!state) return;

      const text = ctx.message.text;

      // ====== РЕГИСТРАЦИЯ ======
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
          // Реальный вызов AuthService для регистрации
          await this.authService.register('User', email, password); // тут name = "User", можно потом спросить имя
          this.logger.log(`✅ Registration done for ${ctx.from.id}`);
        } catch (error) {
          this.logger.warn(`⛔ Registration failed: ${error.message}`);
          this.userState.delete(ctx.from.id);
          return ctx.reply(
            `❌ Ошибка регистрации: ${error.message}`,
            Markup.inlineKeyboard([[Markup.button.callback('⬅️ Назад', 'BACK')]])
          );
        }

        this.userState.delete(ctx.from.id);

        return ctx.reply(
          '✅ Вы успешно зарегистрированы!',
          Markup.inlineKeyboard([[Markup.button.callback('⬅️ Назад', 'BACK')]])
        );
      }

      // ====== ВХОД ======
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

          this.userTokens.set(ctx.from.id, token); // сохраняем JWT для пользователя
          this.logger.log(`✅ Login success for ${ctx.from.id}, token: ${token}`);

          this.userState.delete(ctx.from.id);

          return ctx.reply(
            `✅ Вы успешно вошли!\n\nВаш токен:\n${token}`,
            Markup.inlineKeyboard([[Markup.button.callback('⬅️ Назад', 'BACK')]])
          );
        } catch (error) {
          this.logger.warn(`⛔ Login failed for ${ctx.from.id}: ${error.message}`);
          this.userState.delete(ctx.from.id);
          return ctx.reply(
            `❌ Ошибка входа: ${error.message}`,
            Markup.inlineKeyboard([[Markup.button.callback('⬅️ Назад', 'BACK')]])
          );
        }
      }
    });

    // ====== КНОПКА НАЗАД ======
    bot.action('BACK', async (ctx) => {
      ctx.answerCbQuery();
      this.userState.delete(ctx.from.id);

      await ctx.reply(
        '⬅️ Главное меню',
        Markup.inlineKeyboard([
          [Markup.button.callback('📦 Каталог', 'CATALOG')],
          [Markup.button.callback('🛒 Моя корзина', 'CART')],
          [Markup.button.callback('🎟 Промокод', 'PROMO')],
          [Markup.button.callback('❓ Помощь', 'HELP')],
          [Markup.button.callback('🆕 Регистрация', 'REGISTER')],
          [Markup.button.callback('🔑 Вход', 'LOGIN')],
        ])
      );
    });
  }

  // Получить токен пользователя (для проверки доступа к корзине и промокодам)
  getToken(telegramId: number): string | null {
    return this.userTokens.get(telegramId) || null;
  }
}
