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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const login_response_dto_1 = require("./dto/login-response.dto");
const user_response_dto_1 = require("../users/dto/user-response.dto");
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        this.logger.log(`用户 ${loginDto.username} 尝试登录`);
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            this.logger.warn(`用户 ${loginDto.username} 登录失败: 凭据无效`);
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        if (user.disableFlag) {
            this.logger.warn(`用户 ${loginDto.username} 登录失败: 账户已禁用`);
            throw new common_1.UnauthorizedException('账户已被禁用');
        }
        const payload = {
            username: user.username,
            sub: String(user._id),
        };
        const accessToken = this.jwtService.sign(payload);
        const userResponse = new user_response_dto_1.UserResponseDto(user);
        this.logger.log(`用户 ${loginDto.username} 登录成功`);
        return new login_response_dto_1.LoginResponseDto(accessToken, userResponse);
    }
    async validateUser(username, password) {
        try {
            this.logger.debug(`开始验证用户: ${username}`);
            const user = await this.usersService.findByUsernameForAuth(username);
            if (!user) {
                this.logger.debug(`用户不存在: ${username}`);
                return null;
            }
            this.logger.debug(`用户找到: ${user.username}, disableFlag: ${user.disableFlag}`);
            this.logger.debug(`存储的密码哈希: ${user.password.substring(0, 20)}...`);
            const isPasswordValid = await user.comparePassword(password);
            this.logger.debug(`密码验证结果: ${isPasswordValid}`);
            if (!isPasswordValid) {
                this.logger.debug(`密码验证失败`);
                return null;
            }
            this.logger.debug(`用户验证成功: ${user.username}`);
            return user;
        }
        catch (error) {
            this.logger.error('验证用户时发生错误:', error);
            return null;
        }
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            this.logger.error('验证JWT令牌失败:', error);
            throw new common_1.UnauthorizedException('无效的令牌');
        }
    }
    refreshToken(user) {
        const payload = {
            username: user.username,
            sub: String(user._id),
        };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map