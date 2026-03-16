import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { ProductGender } from 'entity/Product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @Transform(({ value }) => value?.toString())
  price: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  @Min(0)
  count: number;

  // 🔥 ВОТ ОНО
  @IsEnum(ProductGender)
  gender: ProductGender;
}
