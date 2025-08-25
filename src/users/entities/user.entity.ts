import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

export type UserDocument = User &
  Document & {
    comparePassword(candidatePassword: string): Promise<boolean>;
  };

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, minlength: 6 })
  username: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, match: /^1[3-9]\d{9}$/ })
  phone: string;

  @Prop({ required: true, default: false })
  disableFlag: boolean;

  @Prop({ required: true, type: [Number], enum: UserRole })
  roles: UserRole[];

  // timestamps: true 会自动添加 createdAt 和 updatedAt
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    // Type-safe error handling
    const callbackError =
      error instanceof Error ? error : new Error(String(error));
    next(callbackError);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  // Type-safe password comparison
  const userPassword = this.password as string;
  return bcrypt.compare(candidatePassword, userPassword);
};
