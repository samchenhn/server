import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoggerService } from '../logger/logger.service';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService, logger: LoggerService);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(): Promise<UserResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: string): Promise<void>;
    findByEmail(email: string): Promise<UserResponseDto | null>;
    findByUsername(username: string): Promise<UserResponseDto | null>;
}
