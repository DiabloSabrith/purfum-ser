import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductGender {
  MALE = 'male',
  FEMALE = 'female',
  UNISEX = 'unisex',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  count: number;

  @Column({
    type: 'enum',
    enum: ProductGender,
    default: ProductGender.UNISEX,
  })
  gender: ProductGender;

  @Column({ type: 'boolean', default: false }) // 🔥 добавляем флаг
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

