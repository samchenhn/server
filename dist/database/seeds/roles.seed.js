"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_SEED_DATA = void 0;
exports.getRoleSeedData = getRoleSeedData;
exports.getRoleSeedById = getRoleSeedById;
exports.validateRoleSeedData = validateRoleSeedData;
const roles_enum_1 = require("../../common/enums/roles.enum");
exports.ROLE_SEED_DATA = [
    {
        roleId: roles_enum_1.UserRole.SALES,
        name: roles_enum_1.ROLE_NAMES[roles_enum_1.UserRole.SALES],
        description: '负责业务开发、客户维护和订单跟进等销售相关工作',
        isSystem: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
        roleId: roles_enum_1.UserRole.DOCUMENT,
        name: roles_enum_1.ROLE_NAMES[roles_enum_1.UserRole.DOCUMENT],
        description: '负责单证制作、文件审核和报关报检等文档处理工作',
        isSystem: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
        roleId: roles_enum_1.UserRole.SHIPPING,
        name: roles_enum_1.ROLE_NAMES[roles_enum_1.UserRole.SHIPPING],
        description: '负责海运订舱、船期安排和运输协调等物流运输工作',
        isSystem: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
        roleId: roles_enum_1.UserRole.SUPPLY,
        name: roles_enum_1.ROLE_NAMES[roles_enum_1.UserRole.SUPPLY],
        description: '负责货源采购、供应商管理和库存协调等供应链工作',
        isSystem: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
        roleId: roles_enum_1.UserRole.MANAGER,
        name: roles_enum_1.ROLE_NAMES[roles_enum_1.UserRole.MANAGER],
        description: '负责团队管理、业务监督和决策审批等中层管理工作',
        isSystem: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
        roleId: roles_enum_1.UserRole.ADMIN,
        name: roles_enum_1.ROLE_NAMES[roles_enum_1.UserRole.ADMIN],
        description: '系统最高权限角色，负责系统配置、用户管理和权限分配',
        isSystem: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
    },
];
function getRoleSeedData() {
    return exports.ROLE_SEED_DATA.map((role) => ({
        ...role,
        createdAt: new Date(),
    }));
}
function getRoleSeedById(roleId) {
    return exports.ROLE_SEED_DATA.find((role) => role.roleId === roleId);
}
function validateRoleSeedData() {
    const allRoles = Object.values(roles_enum_1.UserRole).filter((value) => typeof value === 'number');
    const seedRoleIds = exports.ROLE_SEED_DATA.map((role) => role.roleId);
    const missingRoles = allRoles.filter((roleId) => !seedRoleIds.includes(roleId));
    if (missingRoles.length > 0) {
        return {
            isValid: false,
            message: `缺少角色的种子数据: ${missingRoles.map(roles_enum_1.getRoleName).join(', ')}`,
            missingRoles,
        };
    }
    if (exports.ROLE_SEED_DATA.length !== 6) {
        return {
            isValid: false,
            message: `期望6个角色，实际提供${exports.ROLE_SEED_DATA.length}个角色`,
        };
    }
    return {
        isValid: true,
        message: '角色种子数据验证通过',
    };
}
//# sourceMappingURL=roles.seed.js.map