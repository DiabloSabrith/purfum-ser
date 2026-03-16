import { Telegraf } from "telegraf";
export declare class AdminBotService {
    private bot;
    constructor();
    start(): Promise<void>;
    getBot(): Telegraf<import("telegraf").Context<import("@telegraf/types").Update>>;
}
