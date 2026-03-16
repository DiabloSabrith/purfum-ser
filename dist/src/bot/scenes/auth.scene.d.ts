import { AuthService } from 'src/auth/auth.service';
import { Telegraf } from 'telegraf';
export declare class AuthScene {
    private readonly authService;
    private readonly logger;
    private userState;
    private userTokens;
    constructor(authService: AuthService);
    register(bot: Telegraf): void;
    getToken(telegramId: number): string | null;
}
