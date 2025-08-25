import { Model } from 'mongoose';
import { RoleSeedData } from './seeds/roles.seed';
import { UserSeedData } from './seeds/users.seed';
import { UserRole } from '../common/enums/roles.enum';
import { Role, RoleDocument } from './entities/role.entity';
import { User, UserDocument } from '../users/entities/user.entity';
export declare class DatabaseSeedService {
    private roleModel;
    private userModel;
    private readonly logger;
    constructor(roleModel: Model<RoleDocument>, userModel: Model<UserDocument>);
    seedAll(): Promise<void>;
    seedRoles(): Promise<void>;
    getRoleSeedData(): RoleSeedData[];
    isRolesInitialized(): Promise<boolean>;
    resetRoles(): Promise<void>;
    getRoleStatistics(): Promise<{
        totalRoles: number;
        systemRoles: number;
        roles: Array<{
            id: UserRole;
            name: string;
        }>;
        seedDataCount: number;
        dbRoles: Role[];
    }>;
    getAllRolesFromDB(): Promise<Role[]>;
    getRoleById(roleId: UserRole): Promise<Role | null>;
    roleExists(roleId: UserRole): Promise<boolean>;
    seedUsers(): Promise<void>;
    getUserSeedData(): UserSeedData[];
    isUsersInitialized(): Promise<boolean>;
    resetUsers(): Promise<void>;
    resetAll(): Promise<void>;
    getAllUsersFromDB(): Promise<User[]>;
    getUserByUsername(username: string): Promise<User | null>;
    userExists(username: string): Promise<boolean>;
}
