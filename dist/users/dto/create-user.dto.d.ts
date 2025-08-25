import { UserRole } from '../../common/enums/roles.enum';
export declare class CreateUserDto {
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    disableFlag: boolean;
    roles: UserRole[];
}
