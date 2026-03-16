import { Controller } from '@nestjs/common';
import { AdminBotService } from './admin-bot.service';

@Controller('admin-bot')
export class AdminBotController {
  constructor(private readonly adminBotService: AdminBotService) {}
}
