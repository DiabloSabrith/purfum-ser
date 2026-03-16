import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'entity/User.entity';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    getToken(telegramId: number): Promise<string | null>;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(name: string, email: string, password: string): Promise<{
        message: string;
    }>;
    validateUser(email: string, password: string): Promise<User>;
    login(user: User, telegramId?: number): Promise<{
        access_token: string;
    }>;
    findByTelegramId(telegramId: number): Promise<User | null>;
}
