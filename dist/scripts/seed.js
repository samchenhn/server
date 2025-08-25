#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("../app.module");
const database_seed_service_1 = require("../database/database-seed.service");
async function bootstrap() {
    const logger = new common_1.Logger('DatabaseSeed');
    try {
        logger.log('启动数据库种子数据初始化...');
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const seedService = app.get(database_seed_service_1.DatabaseSeedService);
        const args = process.argv.slice(2);
        const command = args[0] || 'seed';
        switch (command) {
            case 'seed':
                await seedService.seedAll();
                break;
            case 'reset':
                await seedService.resetAll();
                await seedService.seedAll();
                break;
            case 'status': {
                const isRolesInitialized = await seedService.isRolesInitialized();
                const isUsersInitialized = await seedService.isUsersInitialized();
                const roleStats = await seedService.getRoleStatistics();
                const userSeedData = seedService.getUserSeedData();
                const dbUsers = await seedService.getAllUsersFromDB();
                logger.log('=== 数据库状态 ===');
                logger.log(`角色数据已初始化: ${isRolesInitialized ? '是' : '否'}`);
                logger.log(`用户数据已初始化: ${isUsersInitialized ? '是' : '否'}`);
                logger.log(`数据库中角色数: ${roleStats.totalRoles}`);
                logger.log(`数据库中用户数: ${dbUsers.length}`);
                logger.log(`种子数据角色数: ${roleStats.seedDataCount}`);
                logger.log(`种子数据用户数: ${userSeedData.length}`);
                logger.log(`系统角色数: ${roleStats.systemRoles}`);
                if (roleStats.dbRoles.length > 0) {
                    logger.log('数据库中的角色:');
                    roleStats.dbRoles.forEach((role) => {
                        logger.log(`  - [${role.roleId}] ${role.name}`);
                    });
                }
                else {
                    logger.log('数据库中暂无角色数据');
                }
                if (dbUsers.length > 0) {
                    logger.log('数据库中的用户:');
                    dbUsers.forEach((user) => {
                        logger.log(`  - ${user.name} (${user.username}) - ${user.email}`);
                    });
                }
                else {
                    logger.log('数据库中暂无用户数据');
                }
                logger.log('种子数据定义的角色:');
                roleStats.roles.forEach((role) => {
                    logger.log(`  - [${role.id}] ${role.name}`);
                });
                logger.log('种子数据定义的用户:');
                userSeedData.forEach((user) => {
                    logger.log(`  - ${user.name} (${user.username}) - ${user.email}`);
                });
                break;
            }
            default:
                logger.error(`未知命令: ${command}`);
                logger.log('可用命令:');
                logger.log('  seed   - 初始化种子数据');
                logger.log('  reset  - 重置并重新初始化数据');
                logger.log('  status - 查看数据状态');
                process.exit(1);
        }
        await app.close();
        logger.log('数据库种子数据操作完成');
        process.exit(0);
    }
    catch (error) {
        logger.error('数据库种子数据操作失败:', error);
        process.exit(1);
    }
}
void bootstrap();
//# sourceMappingURL=seed.js.map