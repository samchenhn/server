import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    getProfile(req: any): {
        id: string;
        name: any;
        username: any;
        email: any;
        phone: any;
        disableFlag: any;
        roles: any;
    };
    logout(): {
        message: string;
    };
}
