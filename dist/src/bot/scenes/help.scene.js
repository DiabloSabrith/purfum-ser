"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HelpScene_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpScene = void 0;
const common_1 = require("@nestjs/common");
let HelpScene = HelpScene_1 = class HelpScene {
    logger = new common_1.Logger(HelpScene_1.name);
    register(bot) {
        bot.action('HELP', async (ctx) => {
            ctx.answerCbQuery();
            this.logger.log(`❓ Help clicked by ${ctx.from.id}`);
            await ctx.reply('❓ Поддержка: @your_support');
        });
    }
};
exports.HelpScene = HelpScene;
exports.HelpScene = HelpScene = HelpScene_1 = __decorate([
    (0, common_1.Injectable)()
], HelpScene);
//# sourceMappingURL=help.scene.js.map