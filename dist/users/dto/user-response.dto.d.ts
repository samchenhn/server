import { UserDocument } from '../entities/user.entity';
import { RoleDto } from './role.dto';
export declare class UserResponseDto {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    disableFlag: boolean;
    roles: RoleDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(user: UserDocument);
}
