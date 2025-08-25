import { UserRole } from '../../common/enums/roles.enum';

/**
 * 用户种子数据
 * 用于初始化系统管理员用户
 */
export interface UserSeedData {
  /** 姓名 */
  name: string;
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 邮箱 */
  email: string;
  /** 手机号 */
  phone: string;
  /** 是否禁用 */
  disableFlag: boolean;
  /** 角色列表 */
  roles: UserRole[];
  /** 是否为系统内置用户 */
  isSystem: boolean;
  /** 创建时间 */
  createdAt: Date;
}

/**
 * 系统初始化用户数据
 * 包含系统管理员账户
 */
export const USER_SEED_DATA: UserSeedData[] = [
  {
    name: '陈辉',
    username: 'samchen',
    password: '123456', // 注意：这会被 bcrypt 自动加密
    email: 'samchen@sinabuddy.com',
    phone: '13837147910',
    disableFlag: false, // 启用账户以便能够登录
    roles: [
      UserRole.SALES, // 1 - 业务员
      UserRole.DOCUMENT, // 2 - 单证
      UserRole.SHIPPING, // 3 - 海运
      UserRole.SUPPLY, // 4 - 货源
      UserRole.MANAGER, // 5 - 经理
      UserRole.ADMIN, // 6 - 管理员
    ],
    isSystem: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
];

/**
 * 获取用户种子数据
 * @returns 用户种子数据数组
 */
export function getUserSeedData(): UserSeedData[] {
  return USER_SEED_DATA.map((user) => ({
    ...user,
    createdAt: new Date(), // 使用当前时间作为创建时间
  }));
}

/**
 * 根据用户名获取种子数据
 * @param username 用户名
 * @returns 用户种子数据或undefined
 */
export function getUserSeedByUsername(
  username: string,
): UserSeedData | undefined {
  return USER_SEED_DATA.find((user) => user.username === username);
}

/**
 * 验证用户数据完整性
 * @returns 验证结果
 */
export function validateUserSeedData(): {
  isValid: boolean;
  message: string;
  invalidUsers?: string[];
} {
  const invalidUsers: string[] = [];

  for (const user of USER_SEED_DATA) {
    // 验证必填字段
    if (
      !user.name ||
      !user.username ||
      !user.password ||
      !user.email ||
      !user.phone
    ) {
      invalidUsers.push(`${user.username || '未知用户'}: 缺少必填字段`);
    }

    // 验证用户名长度
    if (user.username && user.username.length < 6) {
      invalidUsers.push(`${user.username}: 用户名长度不足6位`);
    }

    // 验证密码长度
    if (user.password && user.password.length < 6) {
      invalidUsers.push(`${user.username}: 密码长度不足6位`);
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (user.email && !emailRegex.test(user.email)) {
      invalidUsers.push(`${user.username}: 邮箱格式不正确`);
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (user.phone && !phoneRegex.test(user.phone)) {
      invalidUsers.push(`${user.username}: 手机号格式不正确`);
    }

    // 验证角色是否有效
    if (!user.roles || user.roles.length === 0) {
      invalidUsers.push(`${user.username}: 用户必须至少拥有一个角色`);
    }
  }

  if (invalidUsers.length > 0) {
    return {
      isValid: false,
      message: `用户种子数据验证失败: ${invalidUsers.join('; ')}`,
      invalidUsers,
    };
  }

  return {
    isValid: true,
    message: '用户种子数据验证通过',
  };
}
