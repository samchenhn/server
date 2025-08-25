import { UserDocument } from '../entities/user.entity';
import { RoleDto } from './role.dto';

export class UserResponseDto {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  disableFlag: boolean;
  roles: RoleDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserDocument) {
    this.id = String(user._id);
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.phone = user.phone;
    this.disableFlag = user.disableFlag;
    this.roles = user.roles.map((roleId) => new RoleDto(roleId));
    this.createdAt = user.createdAt!;
    this.updatedAt = user.updatedAt!;
  }
}
