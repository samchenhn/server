import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

/**
 * JWT载荷接口
 */
export interface JwtPayload {
  /** 用户名 */
  username: string;
  /** 用户ID */
  sub: string;
  /** 签发时间 */
  iat?: number;
  /** 过期时间 */
  exp?: number;
}

/**
 * JWT认证策略
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      // 从Authorization头部提取Bearer令牌
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 不忽略过期时间
      ignoreExpiration: false,
      // JWT密钥
      secretOrKey: process.env.JWT_SECRET || 'default-secret-key',
    });
  }

  /**
   * 验证JWT载荷
   * @param payload JWT载荷
   * @returns 用户信息
   */
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (user.disableFlag) {
      throw new UnauthorizedException('用户已被禁用');
    }

    return user;
  }
}
