import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * 登录请求数据传输对象
 */
export class LoginDto {
  /** 用户名 */
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  username: string;

  /** 密码 */
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  password: string;
}
