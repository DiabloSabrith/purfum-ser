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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBotUpdate = void 0;
const common_1 = require("@nestjs/common");
const admin_bot_service_1 = require("./admin-bot.service");
const admin_bot_guard_1 = require("./admin-bot.guard");
const product_api_1 = require("./api/product.api");
const order_service_1 = require("../order/order.service");
let AdminBotUpdate = class AdminBotUpdate {
    botService;
    adminGuard;
    productApi;
    orderService;
    sessions = new Map();
    constructor(botService, adminGuard, productApi, orderService) {
        this.botService = botService;
        this.adminGuard = adminGuard;
        this.productApi = productApi;
        this.orderService = orderService;
        const bot = this.botService.getBot();
        bot.start((ctx) => this.handleStart(ctx));
        bot.action('create_product', (ctx) => this.handleCreateProduct(ctx));
        bot.action('edit_product', (ctx) => this.handleEditProduct(ctx));
        bot.action('delete_product', (ctx) => this.handleDeleteProduct(ctx));
        bot.action('get_orders', (ctx) => this.handleGetOrders(ctx));
        bot.action(/edit_\d+/, (ctx) => this.handleEditSelect(ctx));
        bot.action(/delete_\d+/, (ctx) => this.handleDeleteConfirm(ctx));
        bot.action(/delete_yes_\d+/, (ctx) => this.handleDeleteExecute(ctx));
        bot.action('cancel', (ctx) => this.handleCancel(ctx));
        bot.action(/status_\d+/, (ctx) => this.handleChangeOrderStatus(ctx));
        bot.action(/setstatus_\d+_.+/, (ctx) => this.handleSetOrderStatus(ctx));
        bot.action('create_gender_male', (ctx) => this.handleCreateGender(ctx, 'male'));
        bot.action('create_gender_female', (ctx) => this.handleCreateGender(ctx, 'female'));
        bot.action('search_products', async (ctx) => {
            this.sessions.set(ctx.from.id, { mode: 'search', step: 'name' });
            await ctx.reply('Введите название товара (или "-" чтобы пропустить):');
        });
        bot.on('message', (ctx) => this.handleText(ctx));
    }
    async handleStart(ctx) {
        const username = ctx.from?.username;
        if (!username || !this.adminGuard.isAdmin(ctx)) {
            return ctx.reply('⛔ Нет доступа');
        }
        await ctx.reply(`👋 Добро пожаловать в админ-бот

Вы вошли в административную панель.
Этот бот — инструмент для управления сервером и данными.

⚠️ Внимание:
• Все действия влияют напрямую на базу данных
• Изменения необратимы
• Доступ разрешён только доверенным лицам

Пожалуйста, используйте бот ответственно.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔍 Поиск товаров', callback_data: 'search_products' }],
                    [{ text: '➕ Создать товар', callback_data: 'create_product' }],
                    [{ text: '✏️ Редактировать товар', callback_data: 'edit_product' }],
                    [{ text: '❌ Удалить товар', callback_data: 'delete_product' }],
                    [{ text: '📦 Заказы пользователей', callback_data: 'get_orders' }],
                ],
            },
        });
    }
    async handleCreateProduct(ctx) {
        const userId = ctx.from.id;
        this.sessions.set(userId, {
            mode: 'create',
            step: 'gender',
        });
        await ctx.reply('Выберите категорию товара (для кого предназначен товар):', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '👔 Мужская', callback_data: 'create_gender_male' }],
                    [{ text: '👗 Женская', callback_data: 'create_gender_female' }],
                    [{ text: '⚖️ Унисекс', callback_data: 'create_gender_unisex' }],
                ],
            },
        });
    }
    async handleCreateGender(ctx, gender) {
        const userId = ctx.from.id;
        const session = this.sessions.get(userId);
        if (!session)
            return;
        session.gender = gender;
        session.step = 'name';
        let text;
        if (gender === 'male')
            text = '👔 Мужская категория выбрана.\nВведите название товара:';
        else if (gender === 'female')
            text = '👗 Женская категория выбрана.\nВведите название товара:';
        else
            text = '⚖️ Унисекс категория выбрана.\nВведите название товара:';
        await ctx.reply(text);
    }
    async notifyOrderStatus(ctx, orderId, status, alreadySet = false) {
        await ctx.answerCbQuery();
        await ctx.telegram.sendMessage(ctx.chat.id, alreadySet
            ? `⚠️ Статус заказа #${orderId} уже установлен: "${status}"`
            : `✅ Статус заказа #${orderId} изменён на: "${status}"`);
    }
    async renderProductWithActions(ctx, product) {
        await ctx.reply(`📦 ${product.name}
💰 ${product.price}
👤 ${product.gender}
🆔 ID: ${product.id}`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '✏️ ', callback_data: `edit_${product.id}` },
                        { text: '❌ ', callback_data: `delete_${product.id}` },
                    ],
                ],
            },
        });
    }
    async handleEditProduct(ctx) {
        const products = await this.productApi.getProducts();
        if (!products.length)
            return ctx.reply('Товаров пока нет');
        const buttons = products.map(p => [{ text: p.name, callback_data: `edit_${p.id}` }]);
        await ctx.reply('Выберите товар для редактирования:', {
            reply_markup: { inline_keyboard: buttons },
        });
    }
    async handleEditSelect(ctx) {
        const userId = ctx.from.id;
        const data = ctx.callbackQuery && 'data' in ctx.callbackQuery ? ctx.callbackQuery.data : undefined;
        if (!data)
            return;
        if (!data)
            return;
        const productId = Number(data.split('_')[1]);
        const product = (await this.productApi.getProducts()).find(p => p.id === productId);
        if (!product)
            return ctx.reply('Товар не найден');
        this.sessions.set(userId, {
            mode: 'edit',
            productId,
            step: 'name',
            name: product.name,
            description: product.description,
            price: product.price,
            count: product.count,
        });
        await ctx.reply(`✏️ Редактируем "${product.name}"\nВведите новое название:`);
    }
    async handleDeleteProduct(ctx) {
        const products = await this.productApi.getProducts();
        if (!products.length)
            return ctx.reply('Товаров пока нет');
        const buttons = products.map(p => [{ text: p.name, callback_data: `delete_${p.id}` }]);
        await ctx.reply('Выберите товар для удаления:', {
            reply_markup: { inline_keyboard: buttons },
        });
    }
    async handleDeleteConfirm(ctx) {
        const data = ctx.callbackQuery && 'data' in ctx.callbackQuery ? ctx.callbackQuery.data : undefined;
        if (!data)
            return;
        if (!data)
            return;
        const productId = Number(data.split('_')[1]);
        await ctx.reply('⚠️ Вы уверены?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '✅ Да', callback_data: `delete_yes_${productId}` },
                        { text: '❌ Нет', callback_data: 'cancel' },
                    ],
                ],
            },
        });
    }
    async handleDeleteExecute(ctx) {
        const data = ctx.callbackQuery && 'data' in ctx.callbackQuery ? ctx.callbackQuery.data : undefined;
        if (!data)
            return;
        if (!data)
            return;
        const productId = Number(data.split('_')[2]);
        try {
            await this.productApi.deleteProduct(productId);
            await ctx.reply('🗑 Товар удалён');
        }
        catch (err) {
            console.error(err);
            await ctx.reply('❌ Ошибка при удалении товара');
        }
    }
    async handleCancel(ctx) {
        const userId = ctx.from.id;
        this.sessions.delete(userId);
        await ctx.reply('❌ Действие отменено');
    }
    async handleGetOrders(ctx) {
        const orders = await this.productApi.getOrders();
        if (!orders.length)
            return ctx.reply('📦 Заказов пока нет');
        for (const o of orders) {
            await ctx.reply(`Заказ ID: ${o.id}\n` +
                `Товар: ${o.product?.name ?? 'неизвестно'}\n` +
                `Кол-во: ${o.quantity}\n` +
                `Покупатель: ${o.user?.name ?? 'неизвестно'}`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Статус заказа', callback_data: `status_${o.id}` },
                        ],
                    ],
                },
            });
        }
    }
    async handleChangeOrderStatus(ctx) {
        const data = ctx.callbackQuery && 'data' in ctx.callbackQuery ? ctx.callbackQuery.data : undefined;
        if (!data)
            return;
        const orderId = Number(data.split('_')[1]);
        if (!orderId)
            return;
        const orders = await this.productApi.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (!order)
            return;
        await ctx.answerCbQuery();
        const currentKeyboard = [
            [
                { text: 'В пути', callback_data: `setstatus_${orderId}_В пути` },
                { text: 'В пункте выдачи', callback_data: `setstatus_${orderId}_В пункте выдачи` },
            ],
            [{ text: 'Отмена', callback_data: 'cancel' }],
        ];
        try {
            await ctx.editMessageReplyMarkup({ inline_keyboard: currentKeyboard });
        }
        catch (err) {
            if (err.description === 'Bad Request: message is not modified: specified new message content and reply markup are exactly the same as a current content and reply markup of the message') {
                await ctx.answerCbQuery('⚠️ Вы уже просматриваете меню смены статуса');
            }
            else {
                throw err;
            }
        }
    }
    async handleSetOrderStatus(ctx) {
        const data = ctx.callbackQuery && 'data' in ctx.callbackQuery ? ctx.callbackQuery.data : undefined;
        if (!data)
            return;
        const [_, orderIdStr, ...statusParts] = data.split('_');
        const orderId = Number(orderIdStr);
        const newStatus = statusParts.join('_');
        const order = (await this.productApi.getOrders()).find(o => o.id === orderId);
        if (!order)
            return;
        if (order.status === newStatus) {
            await this.notifyOrderStatus(ctx, orderId, newStatus, true);
            return;
        }
        await this.orderService.updateStatus(orderId, newStatus);
        await this.notifyOrderStatus(ctx, orderId, newStatus);
        if (order.status !== newStatus) {
            try {
                await ctx.editMessageText(`Заказ ID: ${order.id}\nСтатус: ${newStatus}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Статус заказа', callback_data: `status_${order.id}` }]
                        ]
                    }
                });
            }
            catch (err) {
                if (!err.description.includes('message is not modified'))
                    throw err;
            }
        }
    }
    async handleText(ctx) {
        const userId = ctx.from.id;
        if (!this.sessions.has(userId))
            return;
        const session = this.sessions.get(userId);
        if (!ctx.message || (!('text' in ctx.message) && !('photo' in ctx.message)))
            return;
        if (session.mode === 'search') {
            const text = 'text' in ctx.message ? ctx.message.text : '';
            if (session.step === 'name') {
                session.name = text !== '-' ? text : undefined;
                session.step = 'gender';
                return ctx.reply('Категория? male / female / -');
            }
            if (session.step === 'gender') {
                session.gender = text !== '-' ? text : undefined;
                session.step = 'price';
                return ctx.reply('Цена диапазон (например: 1000-5000 или "-")');
            }
            if (session.step === 'price') {
                if (text !== '-') {
                    const [min, max] = text.split('-').map(Number);
                    session.minPrice = min;
                    session.maxPrice = max;
                }
                const products = await this.productApi.searchProducts({
                    name: session.name,
                    gender: session.gender,
                    minPrice: session.minPrice,
                    maxPrice: session.maxPrice,
                });
                if (!products.length) {
                    await ctx.reply('❌ Ничего не найдено');
                }
                else {
                    for (const p of products) {
                        await this.renderProductWithActions(ctx, p);
                    }
                }
                this.sessions.delete(userId);
                return;
            }
        }
        switch (session.step) {
            case 'name':
                if (!('text' in ctx.message))
                    return;
                session.name = ctx.message.text;
                session.step = 'description';
                return ctx.reply('Введите описание товара:');
            case 'description':
                if (!('text' in ctx.message))
                    return;
                session.description = ctx.message.text;
                session.step = 'price';
                return ctx.reply('Введите цену товара:');
            case 'price':
                if (!('text' in ctx.message))
                    return;
                const price = parseFloat(ctx.message.text);
                if (isNaN(price))
                    return ctx.reply('Введите корректную цену!');
                session.price = price.toString();
                session.step = 'count';
                return ctx.reply('Введите количество на складе:');
            case 'count':
                if (!('text' in ctx.message))
                    return;
                const count = parseInt(ctx.message.text);
                if (isNaN(count))
                    return ctx.reply('Введите корректное число!');
                session.count = count;
                session.step = 'photo';
                return ctx.reply('📷 Отправьте изображение товара (или "-" чтобы пропустить):');
            case 'photo':
                if (!session || session.step !== 'photo')
                    return ctx.reply('Сначала заполните предыдущие поля!');
                let imageUrl;
                if ('text' in ctx.message && ctx.message.text === '-') {
                    imageUrl = undefined;
                }
                else if ('photo' in ctx.message && Array.isArray(ctx.message.photo)) {
                    const photos = ctx.message.photo;
                    const fileId = photos[photos.length - 1].file_id;
                    try {
                        const fileLink = await ctx.telegram.getFileLink(fileId);
                        imageUrl = fileLink.href;
                    }
                    catch (err) {
                        console.error('Ошибка получения ссылки на фото', err);
                        return ctx.reply('❌ Не удалось получить фото. Попробуйте ещё раз.');
                    }
                }
                else {
                    return ctx.reply('❌ Пожалуйста, отправьте фото или "-" для пропуска');
                }
                const payload = {
                    name: session.name,
                    description: session.description,
                    price: session.price,
                    count: session.count,
                    gender: session.gender,
                    imageUrl,
                };
                try {
                    if (session.mode === 'create') {
                        const product = await this.productApi.createProduct(payload);
                        await ctx.reply(`✅ Товар создан: ${product.name}`);
                    }
                    else if (session.mode === 'edit') {
                        const product = await this.productApi.updateProduct(session.productId, payload);
                        await ctx.reply(`✅ Товар обновлён: ${product.name}`);
                    }
                }
                catch (err) {
                    console.error(err);
                    await ctx.reply('❌ Ошибка при работе с сервером');
                }
                finally {
                    this.sessions.delete(userId);
                }
                return;
        }
    }
};
exports.AdminBotUpdate = AdminBotUpdate;
exports.AdminBotUpdate = AdminBotUpdate = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_bot_service_1.AdminBotService,
        admin_bot_guard_1.AdminBotGuard,
        product_api_1.ProductApi,
        order_service_1.OrderService])
], AdminBotUpdate);
//# sourceMappingURL=admin-bot.update.js.map