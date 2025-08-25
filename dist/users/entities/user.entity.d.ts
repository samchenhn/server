import { Document } from 'mongoose';
import { UserRole } from '../../common/enums/roles.enum';
export type UserDocument = User & Document & {
    comparePassword(candidatePassword: string): Promise<boolean>;
};
export declare class User {
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    disableFlag: boolean;
    roles: UserRole[];
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
