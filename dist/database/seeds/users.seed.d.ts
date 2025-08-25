import { UserRole } from '../../common/enums/roles.enum';
export interface UserSeedData {
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    disableFlag: boolean;
    roles: UserRole[];
    isSystem: boolean;
    createdAt: Date;
}
export declare const USER_SEED_DATA: UserSeedData[];
export declare function getUserSeedData(): UserSeedData[];
export declare function getUserSeedByUsername(username: string): UserSeedData | undefined;
export declare function validateUserSeedData(): {
    isValid: boolean;
    message: string;
    invalidUsers?: string[];
};
