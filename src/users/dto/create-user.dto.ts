import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsBoolean,
  IsArray,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../common/enums/roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, {
    message: 'phone must be a valid Chinese mobile number',
  })
  phone: string;

  @IsNotEmpty()
  @IsBoolean()
  disableFlag: boolean;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(UserRole, {
    each: true,
    message: 'each role must be a valid UserRole',
  })
  roles: UserRole[];
}
