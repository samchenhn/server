import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ROLE_SEED_DATA,
  validateRoleSeedData,
  RoleSeedData,
} from './seeds/roles.seed';
import {
  USER_SEED_DATA,
  validateUserSeedData,
  UserSeedData,
} from './seeds/users.seed';
import { UserRole } from '../common/enums/roles.enum';
import { Role, RoleDocument } from './entities/role.entity';
import { User, UserDocument } from '../users/entities/user.entity';

/**
 * 数据库种子数据服务
 * 用于初始化系统基础数据
 */
@Injectable()
export class DatabaseSeedService {
  private readonly logger = new Logger(DatabaseSeedService.name);

  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * 初始化所有种子数据
   */
  async seedAll(): Promise<void> {
    this.logger.log('开始初始化数据库种子数据...');

    try {
      await this.seedRoles();
      await this.seedUsers();
      this.logger.log('数据库种子数据初始化完成');
    } catch (error) {
      this.logger.error('数据库种子数据初始化失败', error);
      throw error;
    }
  }

  /**
   * 初始化角色数据 - 真正写入MongoDB
   */
  async seedRoles(): Promise<void> {
    this.logger.log('开始初始化角色数据...');

    // 验证种子数据完整性
    const validation = validateRoleSeedData();
    if (!validation.isValid) {
      throw new Error(`角色种子数据验证失败: ${validation.message}`);
    }

    // 检查数据库中是否已经存在角色数据
    const existingRolesCount = await this.roleModel.countDocuments();
    if (existingRolesCount > 0) {
      this.logger.log(
        `数据库中已存在 ${existingRolesCount} 个角色，跳过初始化`,
      );
      return;
    }

    this.logger.log(`准备写入 ${ROLE_SEED_DATA.length} 个系统角色到MongoDB:`);

    // 将种子数据转换为数据库模型格式
    const rolesToInsert = ROLE_SEED_DATA.map((seedRole) => ({
      roleId: seedRole.roleId,
      name: seedRole.name,
      description: seedRole.description,
      isSystem: seedRole.isSystem,
    }));

    try {
      // 批量插入角色数据
      const insertedRoles = await this.roleModel.insertMany(rolesToInsert);

      this.logger.log(`成功写入 ${insertedRoles.length} 个角色到MongoDB:`);
      insertedRoles.forEach((role, index) => {
        this.logger.log(
          `${index + 1}. [${role.roleId}] ${role.name} - ${role.description}`,
        );
      });

      this.logger.log('角色数据初始化完成');
    } catch (error) {
      this.logger.error('写入角色数据失败:', error);
      throw new Error(`角色数据写入失败: ${error.message}`);
    }
  }

  /**
   * 获取角色初始化数据
   * @returns 角色种子数据数组
   */
  getRoleSeedData(): RoleSeedData[] {
    return ROLE_SEED_DATA;
  }

  /**
   * 检查角色数据是否已初始化 - 查询MongoDB
   * @returns 是否已初始化
   */
  async isRolesInitialized(): Promise<boolean> {
    try {
      const count = await this.roleModel.countDocuments();
      return count >= 6; // 期望有6个角色
    } catch (error) {
      this.logger.error('检查角色数据失败:', error);
      return false;
    }
  }

  /**
   * 重置角色数据 - 真正清空并重新写入MongoDB
   * 谨慎使用，仅用于开发环境
   */
  async resetRoles(): Promise<void> {
    this.logger.warn('重置角色数据 - 仅限开发环境使用');

    if (process.env.NODE_ENV === 'production') {
      throw new Error('生产环境禁止重置角色数据');
    }

    try {
      // 清空现有角色数据
      const deleteResult = await this.roleModel.deleteMany({});
      this.logger.log(`已清空 ${deleteResult.deletedCount} 个角色数据`);

      this.logger.log('角色数据重置完成');
    } catch (error) {
      this.logger.error('重置角色数据失败:', error);
      throw new Error(`重置角色数据失败: ${error.message}`);
    }
  }

  /**
   * 获取角色统计信息 - 从 MongoDB 获取实际数据
   * @returns 角色统计
   */
  async getRoleStatistics(): Promise<{
    totalRoles: number;
    systemRoles: number;
    roles: Array<{ id: UserRole; name: string }>;
    seedDataCount: number;
    dbRoles: Role[];
  }> {
    try {
      // 从数据库获取实际角色数据
      const dbRoles = await this.roleModel.find().exec();

      // 获取种子数据统计
      const systemRoles = ROLE_SEED_DATA.filter((role) => role.isSystem);

      return {
        totalRoles: dbRoles.length,
        systemRoles: systemRoles.length,
        roles: ROLE_SEED_DATA.map((role) => ({
          id: role.roleId,
          name: role.name,
        })),
        seedDataCount: ROLE_SEED_DATA.length,
        dbRoles: dbRoles,
      };
    } catch (error) {
      this.logger.error('获取角色统计信息失败:', error);
      // 如果数据库查询失败，返回种子数据
      const systemRoles = ROLE_SEED_DATA.filter((role) => role.isSystem);

      return {
        totalRoles: 0,
        systemRoles: systemRoles.length,
        roles: ROLE_SEED_DATA.map((role) => ({
          id: role.roleId,
          name: role.name,
        })),
        seedDataCount: ROLE_SEED_DATA.length,
        dbRoles: [],
      };
    }
  }

  /**
   * 获取所有角色数据从 MongoDB
   * @returns 数据库中的所有角色
   */
  async getAllRolesFromDB(): Promise<Role[]> {
    try {
      return await this.roleModel.find().sort({ roleId: 1 }).exec();
    } catch (error) {
      this.logger.error('获取角色数据失败:', error);
      return [];
    }
  }

  /**
   * 根据角色ID获取角色
   * @param roleId 角色ID
   * @returns 角色数据或null
   */
  async getRoleById(roleId: UserRole): Promise<Role | null> {
    try {
      return await this.roleModel.findOne({ roleId }).exec();
    } catch (error) {
      this.logger.error(`获取角色 ${roleId} 失败:`, error);
      return null;
    }
  }

  /**
   * 检查特定角色是否存在
   * @param roleId 角色ID
   * @returns 是否存在
   */
  async roleExists(roleId: UserRole): Promise<boolean> {
    try {
      const count = await this.roleModel.countDocuments({ roleId });
      return count > 0;
    } catch (error) {
      this.logger.error(`检查角色 ${roleId} 存在性失败:`, error);
      return false;
    }
  }

  /**
   * 初始化用户数据 - 真正写入MongoDB
   */
  async seedUsers(): Promise<void> {
    this.logger.log('开始初始化用户数据...');

    // 验证种子数据完整性
    const validation = validateUserSeedData();
    if (!validation.isValid) {
      throw new Error(`用户种子数据验证失败: ${validation.message}`);
    }

    // 检查数据库中是否已经存在用户数据
    const existingUsersCount = await this.userModel.countDocuments();
    if (existingUsersCount > 0) {
      this.logger.log(
        `数据库中已存在 ${existingUsersCount} 个用户，跳过初始化`,
      );
      return;
    }

    this.logger.log(`准备写入 ${USER_SEED_DATA.length} 个系统用户到MongoDB:`);

    try {
      // 逐个创建用户以触发 pre-save 中间件进行密码加密
      const insertedUsers: UserDocument[] = [];
      for (const seedUser of USER_SEED_DATA) {
        const user = new this.userModel({
          name: seedUser.name,
          username: seedUser.username,
          password: seedUser.password, // 将被 pre-save 中间件自动加密
          email: seedUser.email,
          phone: seedUser.phone,
          disableFlag: seedUser.disableFlag,
          roles: seedUser.roles,
        });

        const savedUser = await user.save(); // 触发 pre-save 中间件
        insertedUsers.push(savedUser);
      }

      this.logger.log(`成功写入 ${insertedUsers.length} 个用户到MongoDB:`);
      insertedUsers.forEach((user, index) => {
        this.logger.log(
          `${index + 1}. ${user.name} (${user.username}) - ${user.email}`,
        );
      });

      this.logger.log('用户数据初始化完成');
    } catch (error) {
      this.logger.error('写入用户数据失败:', error);
      throw new Error(`用户数据写入失败: ${error.message}`);
    }
  }

  /**
   * 获取用户初始化数据
   * @returns 用户种子数据数组
   */
  getUserSeedData(): UserSeedData[] {
    return USER_SEED_DATA;
  }

  /**
   * 检查用户数据是否已初始化 - 查询MongoDB
   * @returns 是否已初始化
   */
  async isUsersInitialized(): Promise<boolean> {
    try {
      const count = await this.userModel.countDocuments();
      return count >= 1; // 期望至少有一个用户
    } catch (error) {
      this.logger.error('检查用户数据失败:', error);
      return false;
    }
  }

  /**
   * 重置用户数据 - 真正清空并重新写入MongoDB
   * 谨慎使用，仅用于开发环境
   */
  async resetUsers(): Promise<void> {
    this.logger.warn('重置用户数据 - 仅限开发环境使用');

    if (process.env.NODE_ENV === 'production') {
      throw new Error('生产环境禁止重置用户数据');
    }

    try {
      // 清空现有用户数据
      const deleteResult = await this.userModel.deleteMany({});
      this.logger.log(`已清空 ${deleteResult.deletedCount} 个用户数据`);

      this.logger.log('用户数据重置完成');
    } catch (error) {
      this.logger.error('重置用户数据失败:', error);
      throw new Error(`重置用户数据失败: ${error.message}`);
    }
  }

  /**
   * 重置所有数据 - 清空角色和用户数据
   * 谨慎使用，仅用于开发环境
   */
  async resetAll(): Promise<void> {
    this.logger.warn('重置所有数据 - 仅限开发环境使用');

    if (process.env.NODE_ENV === 'production') {
      throw new Error('生产环境禁止重置数据');
    }

    try {
      await this.resetRoles();
      await this.resetUsers();
      this.logger.log('所有数据重置完成');
    } catch (error) {
      this.logger.error('重置数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有用户数据从 MongoDB
   * @returns 数据库中的所有用户
   */
  async getAllUsersFromDB(): Promise<User[]> {
    try {
      return await this.userModel
        .find()
        .select('-password') // 不返回密码字段
        .sort({ createdAt: 1 })
        .exec();
    } catch (error) {
      this.logger.error('获取用户数据失败:', error);
      return [];
    }
  }

  /**
   * 根据用户名获取用户
   * @param username 用户名
   * @returns 用户数据或null
   */
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      return await this.userModel
        .findOne({ username })
        .select('-password')
        .exec();
    } catch (error) {
      this.logger.error(`获取用户 ${username} 失败:`, error);
      return null;
    }
  }

  /**
   * 检查特定用户是否存在
   * @param username 用户名
   * @returns 是否存在
   */
  async userExists(username: string): Promise<boolean> {
    try {
      const count = await this.userModel.countDocuments({ username });
      return count > 0;
    } catch (error) {
      this.logger.error(`检查用户 ${username} 存在性失败:`, error);
      return false;
    }
  }
}
