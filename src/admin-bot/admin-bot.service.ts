import { Injectable } from "@nestjs/common";
import { Telegraf } from "telegraf";

@Injectable()
export class AdminBotService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.ADMIN_BOT!);/* точно будет токен */
  }

  async start() {
    await this.bot.launch();
    console.log('Admin bot started');
  }

  getBot() {
    return this.bot;
  }
}
