import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    validateUser(username: string, password: string): Promise<import("../users/entities/user.entity").UserDocument | null>;
    verifyToken(token: string): Promise<JwtPayload>;
    refreshToken(user: any): string;
}
