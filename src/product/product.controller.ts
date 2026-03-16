import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'entity/Product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  // ==================== GET ====================
  @Get()
  async getAll(): Promise<Product[]> {
    return this.productService.getProducts();
  }

  @Get('search')
  async searchProducts(
    @Query('name') name?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('gender') gender?: 'male' | 'female',
  ) {
    return this.productService.searchProducts({
      name,
      gender,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

@Get('paginated')
async getPaginated(
  @Query('page') page = '1',
  @Query('limit') limit = '20',
  @Query('excludeGender') excludeGender?: 'male' | 'female',
) {
  return this.productService.getProductsPaginated(
    Number(page),
    Number(limit),
    excludeGender,
  );
}


  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Product> {
    return this.productService.getProductById(id);
  }

  // ==================== POST ====================
  @Post()
  async createProduct(
    @Body() payload: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(payload);
  }

  // ==================== PATCH ====================
  @Patch(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() payload: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, payload);
  }

  // ==================== DELETE ====================
  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    await this.productService.deleteProduct(id);
    return { message: 'Товар успешно удалён' };
  }
}
