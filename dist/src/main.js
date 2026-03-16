"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const admin_bot_service_1 = require("./admin-bot/admin-bot.service");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.useGlobalPipes(new common_1.ValidationPipe({
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
        const adminBotService = app.get(admin_bot_service_1.AdminBotService);
        await adminBotService.start();
        console.log('✅ Admin bot запущен');
    }
    catch (err) {
        console.error('🔥 Error during bootstrap:', err);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map