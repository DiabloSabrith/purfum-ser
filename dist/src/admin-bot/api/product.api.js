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
exports.ProductApi = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ProductApi = class ProductApi {
    http;
    constructor(http) {
        this.http = http;
    }
    async getProducts() {
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(`${process.env.API_URL}/products`, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
        }));
        return response.data;
    }
    async createProduct(payload) {
        const response = await (0, rxjs_1.firstValueFrom)(this.http.post(`${process.env.API_URL}/products`, payload, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
        }));
        return response.data;
    }
    async updateProduct(id, payload) {
        const response = await (0, rxjs_1.firstValueFrom)(this.http.patch(`${process.env.API_URL}/products/${id}`, payload, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
        }));
        return response.data;
    }
    async deleteProduct(id) {
        const response = await (0, rxjs_1.firstValueFrom)(this.http.delete(`${process.env.API_URL}/products/${id}`, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
        }));
        return response.data;
    }
    async getOrders() {
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(`${process.env.API_URL}/order`, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
        }));
        return response.data;
    }
    async searchProducts(params) {
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(`${process.env.API_URL}/products/search`, {
            params,
            headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
        }));
        return response.data;
    }
};
exports.ProductApi = ProductApi;
exports.ProductApi = ProductApi = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ProductApi);
//# sourceMappingURL=product.api.js.map