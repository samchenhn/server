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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleSchema = exports.Role = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const roles_enum_1 = require("../../common/enums/roles.enum");
let Role = class Role {
    roleId;
    name;
    description;
    isSystem;
    createdAt;
    updatedAt;
};
exports.Role = Role;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, type: Number, enum: roles_enum_1.UserRole }),
    __metadata("design:type", Number)
], Role.prototype, "roleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: true }),
    __metadata("design:type", Boolean)
], Role.prototype, "isSystem", void 0);
exports.Role = Role = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Role);
exports.RoleSchema = mongoose_1.SchemaFactory.createForClass(Role);
//# sourceMappingURL=role.entity.js.map