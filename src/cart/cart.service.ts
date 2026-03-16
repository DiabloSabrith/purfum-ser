import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'entity/CartItem.entity';
import { Repository } from 'typeorm';
import { User } from 'entity/User.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Получаем корзину по JWT токену (или по telegramId)
async getCartByUser(token: string): Promise<CartItem[]> {
  // Находим пользователя по токену
  const user = await this.userRepository.findOne({ where: { accessToken: token } });
  if (!user) throw new UnauthorizedException('Пользователь не найден');

  // Находим все товары в корзине пользователя
  return this.cartRepository.find({
    where: { user: { id: user.id } }, // только ссылка на user
    relations: ['product'], // подтягиваем данные продукта
  });
}


  // Очистка корзины
  async clearCart(token: string) {
    const user = await this.userRepository.findOne({ where: { accessToken: token } });
    if (!user) throw new UnauthorizedException();

    await this.cartRepository.delete({ user: { id: user.id } });
  }

  // Добавление товара в корзину
  async addToCart(token: string, productId: number, quantity = 1) {
    const user = await this.userRepository.findOne({ where: { accessToken: token } });
    if (!user) throw new UnauthorizedException();

    let item = await this.cartRepository.findOne({ where: { user: { id: user.id }, product: { id: productId } } });
    if (item) {
      item.quantity += quantity;
    } else {
      item = this.cartRepository.create({ user, product: { id: productId } as any, quantity });
    }
    return this.cartRepository.save(item);
  }
  // Удалить один товар из корзины
async removeFromCart(token: string, productId: number) {
  const user = await this.userRepository.findOne({
    where: { accessToken: token },
  })

  if (!user) throw new UnauthorizedException('Пользователь не найден')

  const item = await this.cartRepository.findOne({
    where: {
      user: { id: user.id },
      product: { id: productId },
    },
  })

  if (!item) {
    return { message: 'Товар не найден в корзине' }
  }

  await this.cartRepository.remove(item)

  return { message: 'Товар удалён из корзины' }
}

}
