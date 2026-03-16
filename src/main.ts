import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AdminBotService } from './admin-bot/admin-bot.service'; // ✅ импорт AdminBotService

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    process.on('uncaughtException', (err) => {
      console.error('UNCAUGHT EXCEPTION:', err);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
    });

    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    });

    const port = process.env.PORT || 4444;

    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);

    // ✅ Запуск админ-бота
    const adminBotService = app.get(AdminBotService);
    await adminBotService.start(); // бот стартует после запуска сервера
    console.log('✅ Admin bot запущен');

  } catch (err) {
    console.error('🔥 Error during bootstrap:', err);
  }
}

bootstrap();
