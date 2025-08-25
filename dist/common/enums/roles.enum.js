"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_NAMES = exports.UserRole = void 0;
exports.getRoleName = getRoleName;
exports.getAllRoles = getAllRoles;
var UserRole;
(function (UserRole) {
    UserRole[UserRole["SALES"] = 1] = "SALES";
    UserRole[UserRole["DOCUMENT"] = 2] = "DOCUMENT";
    UserRole[UserRole["SHIPPING"] = 3] = "SHIPPING";
    UserRole[UserRole["SUPPLY"] = 4] = "SUPPLY";
    UserRole[UserRole["MANAGER"] = 5] = "MANAGER";
    UserRole[UserRole["ADMIN"] = 6] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.ROLE_NAMES = {
    [UserRole.SALES]: '业务员',
    [UserRole.DOCUMENT]: '单证',
    [UserRole.SHIPPING]: '海运',
    [UserRole.SUPPLY]: '货源',
    [UserRole.MANAGER]: '经理',
    [UserRole.ADMIN]: '管理员',
};
function getRoleName(role) {
    return exports.ROLE_NAMES[role] || '未知角色';
}
function getAllRoles() {
    return Object.values(UserRole).filter((value) => typeof value === 'number');
}
//# sourceMappingURL=roles.enum.js.map