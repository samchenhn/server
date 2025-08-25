export declare enum UserRole {
    SALES = 1,
    DOCUMENT = 2,
    SHIPPING = 3,
    SUPPLY = 4,
    MANAGER = 5,
    ADMIN = 6
}
export declare const ROLE_NAMES: Record<UserRole, string>;
export declare function getRoleName(role: UserRole): string;
export declare function getAllRoles(): UserRole[];
