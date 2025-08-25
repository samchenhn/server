/**
 * 用户角色枚举
 * 根据业务需求定义的6种系统权限
 */
export enum UserRole {
  /** 业务员 */
  SALES = 1,

  /** 单证 */
  DOCUMENT = 2,

  /** 海运 */
  SHIPPING = 3,

  /** 货源 */
  SUPPLY = 4,

  /** 经理 */
  MANAGER = 5,

  /** 管理员 */
  ADMIN = 6,
}

/**
 * 角色名称映射
 */
export const ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.SALES]: '业务员',
  [UserRole.DOCUMENT]: '单证',
  [UserRole.SHIPPING]: '海运',
  [UserRole.SUPPLY]: '货源',
  [UserRole.MANAGER]: '经理',
  [UserRole.ADMIN]: '管理员',
};

/**
 * 获取角色名称
 * @param role 角色枚举值
 * @returns 角色中文名称
 */
export function getRoleName(role: UserRole): string {
  return ROLE_NAMES[role] || '未知角色';
}

/**
 * 获取所有可用角色
 * @returns 所有角色的数组
 */
export function getAllRoles(): UserRole[] {
  return Object.values(UserRole).filter(
    (value) => typeof value === 'number',
  ) as UserRole[];
}
