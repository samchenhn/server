#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedRoles = seedRoles;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const database_seed_service_1 = require("../database/database-seed.service");
async function seedRoles() {
    const logger = new common_1.Logger('RoleSeedCLI');
    try {
        logger.log('开始连接数据库并初始化角色数据...');
        const app = await core_1.NestFactory.createApplicationContext(database_module_1.DatabaseModule);
        const seedService = app.get(database_seed_service_1.DatabaseSeedService);
        await seedService.seedRoles();
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
    }
    catch (error) {
        logger.error('❌ 角色数据初始化失败:', error.message);
        logger.error('错误详情:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    void seedRoles();
}
//# sourceMappingURL=seed-roles.js.map