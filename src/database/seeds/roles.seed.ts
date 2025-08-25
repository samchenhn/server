import {
  UserRole,
  ROLE_NAMES,
  getRoleName,
} from '../../common/enums/roles.enum';

/**
 * 角色种子数据
 * 用于初始化系统的6种基础权限角色
 */
export interface RoleSeedData {
  /** 角色ID */
  roleId: UserRole;
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  description: string;
  /** 是否为系统内置角色 */
  isSystem: boolean;
  /** 创建时间 */
  createdAt: Date;
}

/**
 * 系统初始化角色数据
 */
export const ROLE_SEED_DATA: RoleSeedData[] = [
  {
    roleId: UserRole.SALES,
    name: ROLE_NAMES[UserRole.SALES],
    description: '负责业务开发、客户维护和订单跟进等销售相关工作',
    isSystem: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    roleId: UserRole.DOCUMENT,
    name: ROLE_NAMES[UserRole.DOCUMENT],
    description: '负责单证制作、文件审核和报关报检等文档处理工作',
    isSystem: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    roleId: UserRole.SHIPPING,
    name: ROLE_NAMES[UserRole.SHIPPING],
    description: '负责海运订舱、船期安排和运输协调等物流运输工作',
    isSystem: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    roleId: UserRole.SUPPLY,
    name: ROLE_NAMES[UserRole.SUPPLY],
    description: '负责货源采购、供应商管理和库存协调等供应链工作',
    isSystem: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    roleId: UserRole.MANAGER,
    name: ROLE_NAMES[UserRole.MANAGER],
    description: '负责团队管理、业务监督和决策审批等中层管理工作',
    isSystem: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    roleId: UserRole.ADMIN,
    name: ROLE_NAMES[UserRole.ADMIN],
    description: '系统最高权限角色，负责系统配置、用户管理和权限分配',
    isSystem: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
];

/**
 * 获取角色种子数据
 * @returns 角色种子数据数组
 */
export function getRoleSeedData(): RoleSeedData[] {
  return ROLE_SEED_DATA.map((role) => ({
    ...role,
    createdAt: new Date(), // 使用当前时间作为创建时间
  }));
}

/**
 * 根据角色ID获取种子数据
 * @param roleId 角色ID
 * @returns 角色种子数据或undefined
 */
export function getRoleSeedById(roleId: UserRole): RoleSeedData | undefined {
  return ROLE_SEED_DATA.find((role) => role.roleId === roleId);
}

/**
 * 验证角色数据完整性
 * @returns 验证结果
 */
export function validateRoleSeedData(): {
  isValid: boolean;
  message: string;
  missingRoles?: UserRole[];
} {
  const allRoles = Object.values(UserRole).filter(
    (value) => typeof value === 'number',
  ) as UserRole[];
  const seedRoleIds = ROLE_SEED_DATA.map((role) => role.roleId);
  const missingRoles = allRoles.filter(
    (roleId) => !seedRoleIds.includes(roleId),
  );

  if (missingRoles.length > 0) {
    return {
      isValid: false,
      message: `缺少角色的种子数据: ${missingRoles.map(getRoleName).join(', ')}`,
      missingRoles,
    };
  }

  if (ROLE_SEED_DATA.length !== 6) {
    return {
      isValid: false,
      message: `期望6个角色，实际提供${ROLE_SEED_DATA.length}个角色`,
    };
  }

  return {
    isValid: true,
    message: '角色种子数据验证通过',
  };
}
