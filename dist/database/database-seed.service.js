"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const roles_seed_1 = require("./seeds/roles.seed");
const users_seed_1 = require("./seeds/users.seed");
const role_entity_1 = require("./entities/role.entity");
const user_entity_1 = require("../users/entities/user.entity");
let DatabaseSeedService = DatabaseSeedService_1 = class DatabaseSeedService {
    roleModel;
    userModel;
    logger = new common_1.Logger(DatabaseSeedService_1.name);
    constructor(roleModel, userModel) {
        this.roleModel = roleModel;
        this.userModel = userModel;
    }
    async seedAll() {
        this.logger.log('开始初始化数据库种子数据...');
        try {
            await this.seedRoles();
            await this.seedUsers();
            this.logger.log('数据库种子数据初始化完成');
        }
        catch (error) {
            this.logger.error('数据库种子数据初始化失败', error);
            throw error;
        }
    }
    async seedRoles() {
        this.logger.log('开始初始化角色数据...');
        const validation = (0, roles_seed_1.validateRoleSeedData)();
        if (!validation.isValid) {
            throw new Error(`角色种子数据验证失败: ${validation.message}`);
        }
        const existingRolesCount = await this.roleModel.countDocuments();
        if (existingRolesCount > 0) {
            this.logger.log(`数据库中已存在 ${existingRolesCount} 个角色，跳过初始化`);
            return;
        }
        this.logger.log(`准备写入 ${roles_seed_1.ROLE_SEED_DATA.length} 个系统角色到MongoDB:`);
        const rolesToInsert = roles_seed_1.ROLE_SEED_DATA.map((seedRole) => ({
            roleId: seedRole.roleId,
            name: seedRole.name,
            description: seedRole.description,
            isSystem: seedRole.isSystem,
        }));
        try {
            const insertedRoles = await this.roleModel.insertMany(rolesToInsert);
            this.logger.log(`成功写入 ${insertedRoles.length} 个角色到MongoDB:`);
            insertedRoles.forEach((role, index) => {
                this.logger.log(`${index + 1}. [${role.roleId}] ${role.name} - ${role.description}`);
            });
            this.logger.log('角色数据初始化完成');
        }
        catch (error) {
            this.logger.error('写入角色数据失败:', error);
            throw new Error(`角色数据写入失败: ${error.message}`);
        }
    }
    getRoleSeedData() {
        return roles_seed_1.ROLE_SEED_DATA;
    }
    async isRolesInitialized() {
        try {
            const count = await this.roleModel.countDocuments();
            return count >= 6;
        }
        catch (error) {
            this.logger.error('检查角色数据失败:', error);
            return false;
        }
    }
    async resetRoles() {
        this.logger.warn('重置角色数据 - 仅限开发环境使用');
        if (process.env.NODE_ENV === 'production') {
            throw new Error('生产环境禁止重置角色数据');
        }
        try {
            const deleteResult = await this.roleModel.deleteMany({});
            this.logger.log(`已清空 ${deleteResult.deletedCount} 个角色数据`);
            this.logger.log('角色数据重置完成');
        }
        catch (error) {
            this.logger.error('重置角色数据失败:', error);
            throw new Error(`重置角色数据失败: ${error.message}`);
        }
    }
    async getRoleStatistics() {
        try {
            const dbRoles = await this.roleModel.find().exec();
            const systemRoles = roles_seed_1.ROLE_SEED_DATA.filter((role) => role.isSystem);
            return {
                totalRoles: dbRoles.length,
                systemRoles: systemRoles.length,
                roles: roles_seed_1.ROLE_SEED_DATA.map((role) => ({
                    id: role.roleId,
                    name: role.name,
                })),
                seedDataCount: roles_seed_1.ROLE_SEED_DATA.length,
                dbRoles: dbRoles,
            };
        }
        catch (error) {
            this.logger.error('获取角色统计信息失败:', error);
            const systemRoles = roles_seed_1.ROLE_SEED_DATA.filter((role) => role.isSystem);
            return {
                totalRoles: 0,
                systemRoles: systemRoles.length,
                roles: roles_seed_1.ROLE_SEED_DATA.map((role) => ({
                    id: role.roleId,
                    name: role.name,
                })),
                seedDataCount: roles_seed_1.ROLE_SEED_DATA.length,
                dbRoles: [],
            };
        }
    }
    async getAllRolesFromDB() {
        try {
            return await this.roleModel.find().sort({ roleId: 1 }).exec();
        }
        catch (error) {
            this.logger.error('获取角色数据失败:', error);
            return [];
        }
    }
    async getRoleById(roleId) {
        try {
            return await this.roleModel.findOne({ roleId }).exec();
        }
        catch (error) {
            this.logger.error(`获取角色 ${roleId} 失败:`, error);
            return null;
        }
    }
    async roleExists(roleId) {
        try {
            const count = await this.roleModel.countDocuments({ roleId });
            return count > 0;
        }
        catch (error) {
            this.logger.error(`检查角色 ${roleId} 存在性失败:`, error);
            return false;
        }
    }
    async seedUsers() {
        this.logger.log('开始初始化用户数据...');
        const validation = (0, users_seed_1.validateUserSeedData)();
        if (!validation.isValid) {
            throw new Error(`用户种子数据验证失败: ${validation.message}`);
        }
        const existingUsersCount = await this.userModel.countDocuments();
        if (existingUsersCount > 0) {
            this.logger.log(`数据库中已存在 ${existingUsersCount} 个用户，跳过初始化`);
            return;
        }
        this.logger.log(`准备写入 ${users_seed_1.USER_SEED_DATA.length} 个系统用户到MongoDB:`);
        try {
            const insertedUsers = [];
            for (const seedUser of users_seed_1.USER_SEED_DATA) {
                const user = new this.userModel({
                    name: seedUser.name,
                    username: seedUser.username,
                    password: seedUser.password,
                    email: seedUser.email,
                    phone: seedUser.phone,
                    disableFlag: seedUser.disableFlag,
                    roles: seedUser.roles,
                });
                const savedUser = await user.save();
                insertedUsers.push(savedUser);
            }
            this.logger.log(`成功写入 ${insertedUsers.length} 个用户到MongoDB:`);
            insertedUsers.forEach((user, index) => {
                this.logger.log(`${index + 1}. ${user.name} (${user.username}) - ${user.email}`);
            });
            this.logger.log('用户数据初始化完成');
        }
        catch (error) {
            this.logger.error('写入用户数据失败:', error);
            throw new Error(`用户数据写入失败: ${error.message}`);
        }
    }
    getUserSeedData() {
        return users_seed_1.USER_SEED_DATA;
    }
    async isUsersInitialized() {
        try {
            const count = await this.userModel.countDocuments();
            return count >= 1;
        }
        catch (error) {
            this.logger.error('检查用户数据失败:', error);
            return false;
        }
    }
    async resetUsers() {
        this.logger.warn('重置用户数据 - 仅限开发环境使用');
        if (process.env.NODE_ENV === 'production') {
            throw new Error('生产环境禁止重置用户数据');
        }
        try {
            const deleteResult = await this.userModel.deleteMany({});
            this.logger.log(`已清空 ${deleteResult.deletedCount} 个用户数据`);
            this.logger.log('用户数据重置完成');
        }
        catch (error) {
            this.logger.error('重置用户数据失败:', error);
            throw new Error(`重置用户数据失败: ${error.message}`);
        }
    }
    async resetAll() {
        this.logger.warn('重置所有数据 - 仅限开发环境使用');
        if (process.env.NODE_ENV === 'production') {
            throw new Error('生产环境禁止重置数据');
        }
        try {
            await this.resetRoles();
            await this.resetUsers();
            this.logger.log('所有数据重置完成');
        }
        catch (error) {
            this.logger.error('重置数据失败:', error);
            throw error;
        }
    }
    async getAllUsersFromDB() {
        try {
            return await this.userModel
                .find()
                .select('-password')
                .sort({ createdAt: 1 })
                .exec();
        }
        catch (error) {
            this.logger.error('获取用户数据失败:', error);
            return [];
        }
    }
    async getUserByUsername(username) {
        try {
            return await this.userModel
                .findOne({ username })
                .select('-password')
                .exec();
        }
        catch (error) {
            this.logger.error(`获取用户 ${username} 失败:`, error);
            return null;
        }
    }
    async userExists(username) {
        try {
            const count = await this.userModel.countDocuments({ username });
            return count > 0;
        }
        catch (error) {
            this.logger.error(`检查用户 ${username} 存在性失败:`, error);
            return false;
        }
    }
};
exports.DatabaseSeedService = DatabaseSeedService;
exports.DatabaseSeedService = DatabaseSeedService = DatabaseSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_entity_1.Role.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DatabaseSeedService);
//# sourceMappingURL=database-seed.service.js.map