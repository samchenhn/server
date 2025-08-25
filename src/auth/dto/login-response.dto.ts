import { UserResponseDto } from '../../users/dto/user-response.dto';

/**
 * 登录响应数据传输对象
 */
export class LoginResponseDto {
  /** 访问令牌 */
  accessToken: string;

  /** 令牌类型 */
  tokenType: string;

  /** 令牌过期时间（秒） */
  expiresIn: number;

  /** 用户信息 */
  user: UserResponseDto;

  constructor(
    accessToken: string,
    user: UserResponseDto,
    expiresIn: number = 3600,
  ) {
    this.accessToken = accessToken;
    this.tokenType = 'Bearer';
    this.expiresIn = expiresIn;
    this.user = user;
  }
}
