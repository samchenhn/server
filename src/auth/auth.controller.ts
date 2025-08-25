import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * 认证控制器
 * 处理用户认证相关的API请求
 */
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * @param loginDto 登录数据
   * @returns 登录响应（包含JWT令牌）
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    this.logger.debug(
      'API Request: {\n  "method": "POST",\n  "url": "/auth/login",\n  "body": {\n    "username": "' +
        loginDto.username +
        '"\n  },\n  "timestamp": "' +
        new Date().toISOString() +
        '"\n}',
    );

    const startTime = Date.now();

    try {
      const result = await this.authService.login(loginDto);

      const responseTime = Date.now() - startTime;
      this.logger.debug(
        'API Response: {\n  "method": "POST",\n  "url": "/auth/login",\n  "statusCode": 200,\n  "timestamp": "' +
          new Date().toISOString() +
          '",\n  "responseTime": "' +
          responseTime +
          'ms"\n}',
      );

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error('登录失败:', error.message);
      this.logger.debug(
        'API Response: {\n  "method": "POST",\n  "url": "/auth/login",\n  "statusCode": ' +
          (error.status || 500) +
          ',\n  "timestamp": "' +
          new Date().toISOString() +
          '",\n  "responseTime": "' +
          responseTime +
          'ms",\n  "error": "' +
          error.message +
          '"\n}',
      );
      throw error;
    }
  }

  /**
   * 获取当前用户信息
   * @param req 请求对象（包含用户信息）
   * @returns 用户信息
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    this.logger.debug(
      'API Request: {\n  "method": "GET",\n  "url": "/auth/profile",\n  "timestamp": "' +
        new Date().toISOString() +
        '"\n}',
    );

    const startTime = Date.now();

    try {
      // req.user 是由JWT策略验证后设置的
      const responseTime = Date.now() - startTime;
      this.logger.debug(
        'API Response: {\n  "method": "GET",\n  "url": "/auth/profile",\n  "statusCode": 200,\n  "timestamp": "' +
          new Date().toISOString() +
          '",\n  "responseTime": "' +
          responseTime +
          'ms"\n}',
      );

      return {
        id: String(req.user._id),
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        phone: req.user.phone,
        disableFlag: req.user.disableFlag,
        roles: req.user.roles,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error('获取用户信息失败:', error.message);
      this.logger.debug(
        'API Response: {\n  "method": "GET",\n  "url": "/auth/profile",\n  "statusCode": ' +
          (error.status || 500) +
          ',\n  "timestamp": "' +
          new Date().toISOString() +
          '",\n  "responseTime": "' +
          responseTime +
          'ms",\n  "error": "' +
          error.message +
          '"\n}',
      );
      throw error;
    }
  }

  /**
   * 登出（在实际场景中，JWT令牌通常由客户端管理）
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout() {
    this.logger.debug(
      'API Request: {\n  "method": "POST",\n  "url": "/auth/logout",\n  "timestamp": "' +
        new Date().toISOString() +
        '"\n}',
    );

    const startTime = Date.now();
    const responseTime = Date.now() - startTime;

    this.logger.debug(
      'API Response: {\n  "method": "POST",\n  "url": "/auth/logout",\n  "statusCode": 200,\n  "timestamp": "' +
        new Date().toISOString() +
        '",\n  "responseTime": "' +
        responseTime +
        'ms"\n}',
    );

    return {
      message: '登出成功，请在客户端清除令牌',
    };
  }
}
