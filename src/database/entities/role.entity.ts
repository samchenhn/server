import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../common/enums/roles.enum';

export type RoleDocument = Role & Document;

/**
 * 角色实体模型
 * 用于MongoDB存储角色权限数据
 */
@Schema({ timestamps: true })
export class Role {
  /** 角色ID */
  @Prop({ required: true, unique: true, type: Number, enum: UserRole })
  roleId: UserRole;

  /** 角色名称 */
  @Prop({ required: true })
  name: string;

  /** 角色描述 */
  @Prop({ required: true })
  description: string;

  /** 是否为系统内置角色 */
  @Prop({ required: true, default: true })
  isSystem: boolean;

  // timestamps: true 会自动添加 createdAt 和 updatedAt
  createdAt?: Date;
  updatedAt?: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
