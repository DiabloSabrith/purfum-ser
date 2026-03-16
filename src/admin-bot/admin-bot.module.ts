import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';           // ✅ добавил правильный HttpModule
import { AdminBotService } from './admin-bot.service';
import { AdminBotUpdate } from './admin-bot.update';  // ✅ добавил обработчики бота
import { AdminBotGuard } from './admin-bot.guard';    // ✅ проверка админов
import { ProductApi } from './api/product.api';      // ✅ для вызовов Product API
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    ConfigModule,   // для доступа к process.env
    HttpModule,     
    OrderModule// ✅ теперь есть HttpService для запросов к backend
  ],
  providers: [
    AdminBotService,
    AdminBotUpdate, // ✅ чтобы бот сразу мог инициализироваться
    AdminBotGuard,
    ProductApi,     // ✅ чтобы бот мог работать с товарами
  ],
})
export class AdminBotModule {}
