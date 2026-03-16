import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './Product.entity';
import { User } from './User.entity';

export type OrderStatus = 'Оформлен' | 'В пути' | 'В пункте выдачи' | 'Отменен';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  telegramId?: number;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  delivery: string;

  @Column({ type: 'varchar', default: 'Оформлен' })
  status: OrderStatus;

  @Column({ type: 'int', default: 1 })
  quantity: number; // ✅ добавляем поле кол-во

  @ManyToOne(() => Product, { eager: true, nullable: true })
  @JoinColumn({ name: 'productId' })
  product?: Product;

  @ManyToOne(() => User, { eager: true, nullable: true }) // ✅ связь с пользователем
  @JoinColumn({ name: 'userId' })
  user?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
