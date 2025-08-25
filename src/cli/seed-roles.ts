#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DatabaseSeedService } from '../database/database-seed.service';

/**
 * CLI 脚本：初始化角色数据到 MongoDB
 *
 * 使用方法:
 * npm run seed:roles
 * 或
 * ts-node src/cli/seed-roles.ts
 */

async function seedRoles() {
  const logger = new Logger('RoleSeedCLI');

  try {
    logger.log('开始连接数据库并初始化角色数据...');

    // 创建 NestJS 应用实例
    const app = await NestFactory.createApplicationContext(DatabaseModule);

    // 获取数据库种子服务
    const seedService = app.get(DatabaseSeedService);

    // 执行角色数据初始化
    await seedService.seedRoles();

    // 显示初始化结果
    const stats = await seedService.getRoleStatistics();
    logger.log('=== 角色初始化完成 ===');
    logger.log(`数据库中角色总数: ${stats.totalRoles}`);
    logger.log(`系统角色数量: ${stats.systemRoles}`);

    logger.log('\n角色列表:');
    for (const role of stats.dbRoles) {
      logger.log(`- [${role.roleId}] ${role.name}`);
    }

    await app.close();
    logger.log('\n✅ 角色数据初始化成功完成！');
    process.exit(0);
  } catch (error) {
    logger.error('❌ 角色数据初始化失败:', error.message);
    logger.error('错误详情:', error);
    process.exit(1);
  }
}

// 检查是否直接运行此脚本
if (require.main === module) {
  void seedRoles();
}

export { seedRoles };
