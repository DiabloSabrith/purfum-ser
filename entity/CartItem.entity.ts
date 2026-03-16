import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './User.entity';
import { Product } from './Product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
/* Именя  данные  потгиваютсья   с    сущности  продукт  вот  */
