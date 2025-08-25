"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleDto = void 0;
const roles_enum_1 = require("../../common/enums/roles.enum");
class RoleDto {
    roleId;
    name;
    constructor(roleId) {
        this.roleId = roleId;
        this.name = (0, roles_enum_1.getRoleName)(roleId);
    }
}
exports.RoleDto = RoleDto;
//# sourceMappingURL=role.dto.js.map