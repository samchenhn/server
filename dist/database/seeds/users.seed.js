"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_SEED_DATA = void 0;
exports.getUserSeedData = getUserSeedData;
exports.getUserSeedByUsername = getUserSeedByUsername;
exports.validateUserSeedData = validateUserSeedData;
const roles_enum_1 = require("../../common/enums/roles.enum");
exports.USER_SEED_DATA = [
    {
        name: '陈辉',
        username: 'samchen',
        password: '123456',
        email: 'samchen@sinabuddy.com',
        phone: '13837147910',
        disableFlag: false,
        roles: [
            roles_enum_1.UserRole.SALES,
            roles_enum_1.UserRole.DOCUMENT,
            roles_enum_1.UserRole.SHIPPING,
            roles_enum_1.UserRole.SUPPLY,
            roles_enum_1.UserRole.MANAGER,
            roles_enum_1.UserRole.ADMIN,
        ],
        isSystem: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
    },
];
function getUserSeedData() {
    return exports.USER_SEED_DATA.map((user) => ({
        ...user,
        createdAt: new Date(),
    }));
}
function getUserSeedByUsername(username) {
    return exports.USER_SEED_DATA.find((user) => user.username === username);
}
function validateUserSeedData() {
    const invalidUsers = [];
    for (const user of exports.USER_SEED_DATA) {
        if (!user.name ||
            !user.username ||
            !user.password ||
            !user.email ||
            !user.phone) {
            invalidUsers.push(`${user.username || '未知用户'}: 缺少必填字段`);
        }
        if (user.username && user.username.length < 6) {
            invalidUsers.push(`${user.username}: 用户名长度不足6位`);
        }
        if (user.password && user.password.length < 6) {
            invalidUsers.push(`${user.username}: 密码长度不足6位`);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (user.email && !emailRegex.test(user.email)) {
            invalidUsers.push(`${user.username}: 邮箱格式不正确`);
        }
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (user.phone && !phoneRegex.test(user.phone)) {
            invalidUsers.push(`${user.username}: 手机号格式不正确`);
        }
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
//# sourceMappingURL=users.seed.js.map