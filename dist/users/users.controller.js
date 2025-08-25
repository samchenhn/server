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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const logger_service_1 = require("../logger/logger.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UsersController = class UsersController {
    usersService;
    logger;
    constructor(usersService, logger) {
        this.usersService = usersService;
        this.logger = logger;
    }
    async create(createUserDto) {
        this.logger.log(`Creating new user with name: ${createUserDto.name} and email: ${createUserDto.email}`, 'UsersController.create');
        const result = await this.usersService.create(createUserDto);
        this.logger.log(`User created successfully with ID: ${result.id}`, 'UsersController.create');
        return result;
    }
    async findAll() {
        this.logger.log('Fetching all users', 'UsersController.findAll');
        const result = await this.usersService.findAll();
        this.logger.log(`Found ${result.length} users`, 'UsersController.findAll');
        return result;
    }
    async findOne(id) {
        this.logger.log(`Fetching user with ID: ${id}`, 'UsersController.findOne');
        const result = await this.usersService.findOne(id);
        this.logger.log(`User found: ${result.name} (${result.username})`, 'UsersController.findOne');
        return result;
    }
    async update(id, updateUserDto) {
        this.logger.log(`Updating user with ID: ${id}`, 'UsersController.update');
        const result = await this.usersService.update(id, updateUserDto);
        this.logger.log(`User updated successfully: ${result.name} (${result.username})`, 'UsersController.update');
        return result;
    }
    async remove(id) {
        this.logger.log(`Deleting user with ID: ${id}`, 'UsersController.remove');
        await this.usersService.remove(id);
        this.logger.log(`User deleted successfully with ID: ${id}`, 'UsersController.remove');
    }
    async findByEmail(email) {
        this.logger.log(`Searching user by email: ${email}`, 'UsersController.findByEmail');
        const result = await this.usersService.findByEmail(email);
        if (result) {
            this.logger.log(`User found by email: ${result.name} (${result.username})`, 'UsersController.findByEmail');
        }
        else {
            this.logger.log(`No user found with email: ${email}`, 'UsersController.findByEmail');
        }
        return result;
    }
    async findByUsername(username) {
        this.logger.log(`Searching user by username: ${username}`, 'UsersController.findByUsername');
        const result = await this.usersService.findByUsername(username);
        if (result) {
            this.logger.log(`User found by username: ${result.name} (${result.email})`, 'UsersController.findByUsername');
        }
        else {
            this.logger.log(`No user found with username: ${username}`, 'UsersController.findByUsername');
        }
        return result;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)('username/:username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByUsername", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        logger_service_1.LoggerService])
], UsersController);
//# sourceMappingURL=users.controller.js.map