"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = void 0;
const role_dto_1 = require("./role.dto");
class UserResponseDto {
    id;
    name;
    username;
    email;
    phone;
    disableFlag;
    roles;
    createdAt;
    updatedAt;
    constructor(user) {
        this.id = String(user._id);
        this.name = user.name;
        this.username = user.username;
        this.email = user.email;
        this.phone = user.phone;
        this.disableFlag = user.disableFlag;
        this.roles = user.roles.map((roleId) => new role_dto_1.RoleDto(roleId));
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}
exports.UserResponseDto = UserResponseDto;
//# sourceMappingURL=user-response.dto.js.map