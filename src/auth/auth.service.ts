import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { User } from 'entity/User.entity';

@Injectable()
export class AuthService {
  async getToken(telegramId: number): Promise<string | null> {
  const user = await this.findByTelegramId(telegramId);
  if (!user || !user.accessToken) return null;
  return user.accessToken;
}

 
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Регистрация
  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) throw new UnauthorizedException('Email уже зарегистрирован');

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({ name, email, passwordHash: hash });
    await this.usersRepository.save(user);
    return { message: 'User registered successfully' };
  }

  // Проверка пользователя при логине
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email или пароль неверные');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Email или пароль неверные');

    return user;
  }

  // Генерация JWT
async login(user: User, telegramId?: number) {
  const payload = { email: user.email, sub: user.id };
  const token = this.jwtService.sign(payload);

  user.accessToken = token;

  // ✅ сохраняем telegramId только если пришёл реально
  if (telegramId) {
    user.telegramId = telegramId;
  }

  await this.usersRepository.save(user);

  return { access_token: token };
}


  // ===== Поиск пользователя по Telegram ID =====
  async findByTelegramId(telegramId: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { telegramId } });
  }
}
