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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthController = AuthController_1 = class AuthController {
    authService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        this.logger.debug('API Request: {\n  "method": "POST",\n  "url": "/auth/login",\n  "body": {\n    "username": "' +
            loginDto.username +
            '"\n  },\n  "timestamp": "' +
            new Date().toISOString() +
            '"\n}');
        const startTime = Date.now();
        try {
            const result = await this.authService.login(loginDto);
            const responseTime = Date.now() - startTime;
            this.logger.debug('API Response: {\n  "method": "POST",\n  "url": "/auth/login",\n  "statusCode": 200,\n  "timestamp": "' +
                new Date().toISOString() +
                '",\n  "responseTime": "' +
                responseTime +
                'ms"\n}');
            return result;
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            this.logger.error('登录失败:', error.message);
            this.logger.debug('API Response: {\n  "method": "POST",\n  "url": "/auth/login",\n  "statusCode": ' +
                (error.status || 500) +
                ',\n  "timestamp": "' +
                new Date().toISOString() +
                '",\n  "responseTime": "' +
                responseTime +
                'ms",\n  "error": "' +
                error.message +
                '"\n}');
            throw error;
        }
    }
    getProfile(req) {
        this.logger.debug('API Request: {\n  "method": "GET",\n  "url": "/auth/profile",\n  "timestamp": "' +
            new Date().toISOString() +
            '"\n}');
        const startTime = Date.now();
        try {
            const responseTime = Date.now() - startTime;
            this.logger.debug('API Response: {\n  "method": "GET",\n  "url": "/auth/profile",\n  "statusCode": 200,\n  "timestamp": "' +
                new Date().toISOString() +
                '",\n  "responseTime": "' +
                responseTime +
                'ms"\n}');
            return {
                id: String(req.user._id),
                name: req.user.name,
                username: req.user.username,
                email: req.user.email,
                phone: req.user.phone,
                disableFlag: req.user.disableFlag,
                roles: req.user.roles,
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            this.logger.error('获取用户信息失败:', error.message);
            this.logger.debug('API Response: {\n  "method": "GET",\n  "url": "/auth/profile",\n  "statusCode": ' +
                (error.status || 500) +
                ',\n  "timestamp": "' +
                new Date().toISOString() +
                '",\n  "responseTime": "' +
                responseTime +
                'ms",\n  "error": "' +
                error.message +
                '"\n}');
            throw error;
        }
    }
    logout() {
        this.logger.debug('API Request: {\n  "method": "POST",\n  "url": "/auth/logout",\n  "timestamp": "' +
            new Date().toISOString() +
            '"\n}');
        const startTime = Date.now();
        const responseTime = Date.now() - startTime;
        this.logger.debug('API Response: {\n  "method": "POST",\n  "url": "/auth/logout",\n  "statusCode": 200,\n  "timestamp": "' +
            new Date().toISOString() +
            '",\n  "responseTime": "' +
            responseTime +
            'ms"\n}');
        return {
            message: '登出成功，请在客户端清除令牌',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map