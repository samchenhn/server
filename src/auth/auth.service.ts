import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';

/**
 * 认证服务
 * 处理用户登录、JWT生成和验证
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 验证用户登录凭据
   * @param loginDto 登录数据
   * @returns 登录响应
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log(`用户 ${loginDto.username} 尝试登录`);

    // 验证用户凭据
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      this.logger.warn(`用户 ${loginDto.username} 登录失败: 凭据无效`);
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 检查用户状态
    if (user.disableFlag) {
      this.logger.warn(`用户 ${loginDto.username} 登录失败: 账户已禁用`);
      throw new UnauthorizedException('账户已被禁用');
    }

    // 生成JWT令牌
    const payload: JwtPayload = {
      username: user.username,
      sub: String(user._id),
    };

    const accessToken = this.jwtService.sign(payload);
    const userResponse = new UserResponseDto(user);

    this.logger.log(`用户 ${loginDto.username} 登录成功`);

    return new LoginResponseDto(accessToken, userResponse);
  }

  /**
   * 验证用户名和密码
   * @param username 用户名
   * @param password 密码
   * @returns 用户信息或null
   */
  async validateUser(username: string, password: string) {
    try {
      this.logger.debug(`开始验证用户: ${username}`);
      const user = await this.usersService.findByUsernameForAuth(username);
      if (!user) {
        this.logger.debug(`用户不存在: ${username}`);
        return null;
      }

      this.logger.debug(
        `用户找到: ${user.username}, disableFlag: ${user.disableFlag}`,
      );
      this.logger.debug(`存储的密码哈希: ${user.password.substring(0, 20)}...`);

      // 验证密码
      const isPasswordValid = await user.comparePassword(password);
      this.logger.debug(`密码验证结果: ${isPasswordValid}`);

      if (!isPasswordValid) {
        this.logger.debug(`密码验证失败`);
        return null;
      }

      this.logger.debug(`用户验证成功: ${user.username}`);
      return user;
    } catch (error) {
      this.logger.error('验证用户时发生错误:', error);
      return null;
    }
  }

  /**
   * 验证JWT令牌
   * @param token JWT令牌
   * @returns JWT载荷
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error('验证JWT令牌失败:', error);
      throw new UnauthorizedException('无效的令牌');
    }
  }

  /**
   * 刷新JWT令牌
   * @param user 用户信息
   * @returns 新的访问令牌
   */
  refreshToken(user: any): string {
    const payload: JwtPayload = {
      username: user.username,
      sub: String(user._id),
    };

    return this.jwtService.sign(payload);
  }
}
