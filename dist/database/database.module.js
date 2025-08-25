"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const database_seed_service_1 = require("./database-seed.service");
const role_entity_1 = require("./entities/role.entity");
const user_entity_1 = require("../users/entities/user.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb://localhost:27017/nest-users', {
                retryWrites: true,
                w: 'majority',
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: role_entity_1.Role.name, schema: role_entity_1.RoleSchema },
                { name: user_entity_1.User.name, schema: user_entity_1.UserSchema },
            ]),
        ],
        providers: [database_seed_service_1.DatabaseSeedService],
        exports: [mongoose_1.MongooseModule, database_seed_service_1.DatabaseSeedService],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map