import { UserRole, getRoleName } from '../../common/enums/roles.enum';

/**
 * 角色响应数据传输对象
 */
export class RoleDto {
  /** 角色ID */
  roleId: UserRole;

  /** 角色名称 */
  name: string;

  constructor(roleId: UserRole) {
    this.roleId = roleId;
    this.name = getRoleName(roleId);
  }
}
