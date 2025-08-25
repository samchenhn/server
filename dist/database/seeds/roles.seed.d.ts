import { UserRole } from '../../common/enums/roles.enum';
export interface RoleSeedData {
    roleId: UserRole;
    name: string;
    description: string;
    isSystem: boolean;
    createdAt: Date;
}
export declare const ROLE_SEED_DATA: RoleSeedData[];
export declare function getRoleSeedData(): RoleSeedData[];
export declare function getRoleSeedById(roleId: UserRole): RoleSeedData | undefined;
export declare function validateRoleSeedData(): {
    isValid: boolean;
    message: string;
    missingRoles?: UserRole[];
};
