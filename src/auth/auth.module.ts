import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { User } from 'entity/User.entity';

@Module({
  imports: [
    // Подключаем TypeORM для работы с пользователями
    TypeOrmModule.forFeature([User]),

    // Passport для стратегии JWT
    PassportModule,

    // JWT модуль для генерации токенов
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'superSecretKey', // в продакшене — из .env
      signOptions: { expiresIn: '6h' }, // срок жизни токена
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // чтобы AuthService можно было использовать в других модулях
})
export class AuthModule {}
