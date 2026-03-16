import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'entity/Product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { createS3Client } from 's3.config';
import { transliterate } from 'transliteration';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {}

  // Получаем все продукты
async getProducts(): Promise<Product[]> {
  try {
    return await this.productRepository.find({ where: { isDeleted: false } });
  } catch (err) {
    throw new InternalServerErrorException('Не удалось получить товары');
  }
}


  // Получаем продукт по ID
  async getProductById(productId: number): Promise<Product> {
  const product = await this.productRepository.findOne({
    where: { id: productId, isDeleted: false },
  });

  if (!product) {
    throw new NotFoundException('Продукт не найден');
  }

  return product;
}


  // ====== ПАГИНАЦИЯ также  получнеи  товаров по категоиям 
async getProductsPaginated(
  page = 1,
  limit = 20,
  excludeGender?: 'male' | 'female'
) {
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


  /* Загрузка картинки по URL в Yandex Object Storage */
  async uploadFromUrl(imageUrl: string): Promise<string> {
  try {
    const s3 = createS3Client(this.configService);
    const bucket = this.configService.get<string>('YC_BUCKET')!;

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    // 🔥 убираем проверку content-type
    const key = `products/${uuid()}.jpg`;

    const uploadResult = await s3.upload({
      Bucket: bucket,
      Key: key,
      Body: response.data,
      ContentType: 'image/jpeg', // Можно всегда jpg, Telegram файлы норм
      ACL: 'public-read',
    }).promise();

    return uploadResult.Location;
  } catch (err) {
    console.error('uploadFromUrl failed:', err.message);
    throw new InternalServerErrorException('Не удалось загрузить картинку');
  }
}


  /* Создание товара */
  async createProduct(dto: CreateProductDto): Promise<Product> {
  try {
    let finalImageUrl: string | undefined;

    if (dto.imageUrl) {
      finalImageUrl = await this.uploadFromUrl(dto.imageUrl);
    }

    const product = this.productRepository.create({
      ...dto,
      imageUrl: finalImageUrl,
    });

    return await this.productRepository.save(product);
  } catch (err) {
    console.error('createProduct error:', err);
    throw new InternalServerErrorException('Не удалось создать товар');
  }
}


  /* Обновление товара */
  async updateProduct(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.imageUrl !== undefined) product.imageUrl = dto.imageUrl;
    if (dto.count !== undefined) product.count = dto.count;

    return await this.productRepository.save(product);
  }

  /* Удаление товара */
async deleteProduct(id: number): Promise<void> {
  const product = await this.productRepository.findOne({ where: { id } });
  if (!product) throw new NotFoundException('Продукт не найден');

  // логическое удаление
  product.isDeleted = true;
  await this.productRepository.save(product);
}



  /* Поиск товаров */
 async searchProducts(filters: {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: 'male' | 'female';
}) {
  const qb = this.productRepository.createQueryBuilder('product');

  // Только не удалённые
  qb.andWhere('product.isDeleted = false');

  if (filters.name) {
    const search = filters.name.toLowerCase(); // пользовательский ввод
    const translitSearch = transliterate(search); // транслит

    // Ищем совпадения по оригинальному имени и транслиту
    qb.andWhere(
      '(LOWER(product.name) LIKE :search OR LOWER(product.name) LIKE :translit)',
      {
        search: `%${search}%`,
        translit: `%${translitSearch}%`,
      }
    );
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

}
