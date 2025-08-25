import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserDocument } from './entities/user.entity';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(): Promise<UserResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: string): Promise<void>;
    findByEmail(email: string): Promise<UserResponseDto | null>;
    findByUsername(username: string): Promise<UserResponseDto | null>;
    findByUsernameForAuth(username: string): Promise<UserDocument | null>;
    validateUser(username: string, password: string): Promise<UserResponseDto | null>;
}
