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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Product_entity_1 = require("../../entity/Product.entity");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const config_1 = require("@nestjs/config");
const s3_config_1 = require("../../s3.config");
const transliteration_1 = require("transliteration");
let ProductService = class ProductService {
    productRepository;
    configService;
    constructor(productRepository, configService) {
        this.productRepository = productRepository;
        this.configService = configService;
    }
    async getProducts() {
        try {
            return await this.productRepository.find({ where: { isDeleted: false } });
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Не удалось получить товары');
        }
    }
    async getProductById(productId) {
        const product = await this.productRepository.findOne({
            where: { id: productId, isDeleted: false },
        });
        if (!product) {
            throw new common_1.NotFoundException('Продукт не найден');
        }
        return product;
    }
    async getProductsPaginated(page = 1, limit = 20, excludeGender) {
        const qb = this.productRepository.createQueryBuilder('product');
        qb.where('product.isDeleted = false');
        if (excludeGender) {
            qb.andWhere('product.gender != :excludeGender', {
                excludeGender,
            });
        }
        qb.orderBy('product.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [items, total] = await qb.getManyAndCount();
        return {
            items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async uploadFromUrl(imageUrl) {
        try {
            const s3 = (0, s3_config_1.createS3Client)(this.configService);
            const bucket = this.configService.get('YC_BUCKET');
            const response = await axios_1.default.get(imageUrl, {
                responseType: 'arraybuffer',
            });
            const key = `products/${(0, uuid_1.v4)()}.jpg`;
            const uploadResult = await s3.upload({
                Bucket: bucket,
                Key: key,
                Body: response.data,
                ContentType: 'image/jpeg',
                ACL: 'public-read',
            }).promise();
            return uploadResult.Location;
        }
        catch (err) {
            console.error('uploadFromUrl failed:', err.message);
            throw new common_1.InternalServerErrorException('Не удалось загрузить картинку');
        }
    }
    async createProduct(dto) {
        try {
            let finalImageUrl;
            if (dto.imageUrl) {
                finalImageUrl = await this.uploadFromUrl(dto.imageUrl);
            }
            const product = this.productRepository.create({
                ...dto,
                imageUrl: finalImageUrl,
            });
            return await this.productRepository.save(product);
        }
        catch (err) {
            console.error('createProduct error:', err);
            throw new common_1.InternalServerErrorException('Не удалось создать товар');
        }
    }
    async updateProduct(id, dto) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Продукт не найден');
        }
        if (dto.name !== undefined)
            product.name = dto.name;
        if (dto.description !== undefined)
            product.description = dto.description;
        if (dto.imageUrl !== undefined)
            product.imageUrl = dto.imageUrl;
        if (dto.count !== undefined)
            product.count = dto.count;
        return await this.productRepository.save(product);
    }
    async deleteProduct(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Продукт не найден');
        product.isDeleted = true;
        await this.productRepository.save(product);
    }
    async searchProducts(filters) {
        const qb = this.productRepository.createQueryBuilder('product');
        qb.andWhere('product.isDeleted = false');
        if (filters.name) {
            const search = filters.name.toLowerCase();
            const translitSearch = (0, transliteration_1.transliterate)(search);
            qb.andWhere('(LOWER(product.name) LIKE :search OR LOWER(product.name) LIKE :translit)', {
                search: `%${search}%`,
                translit: `%${translitSearch}%`,
            });
        }
        if (filters.gender) {
            qb.andWhere('product.gender = :gender', {
                gender: filters.gender,
            });
        }
        if (filters.minPrice) {
            qb.andWhere('product.price >= :minPrice', {
                minPrice: filters.minPrice,
            });
        }
        if (filters.maxPrice) {
            qb.andWhere('product.price <= :maxPrice', {
                maxPrice: filters.maxPrice,
            });
        }
        qb.orderBy('product.createdAt', 'DESC');
        return qb.getMany();
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], ProductService);
//# sourceMappingURL=product.service.js.map