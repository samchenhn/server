import { Document } from 'mongoose';
import { UserRole } from '../../common/enums/roles.enum';
export type RoleDocument = Role & Document;
export declare class Role {
    roleId: UserRole;
    name: string;
    description: string;
    isSystem: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const RoleSchema: import("mongoose").Schema<Role, import("mongoose").Model<Role, any, any, any, Document<unknown, any, Role, any, {}> & Role & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Role, Document<unknown, {}, import("mongoose").FlatRecord<Role>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Role> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
