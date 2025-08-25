/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UserRole } from '../common/enums/roles.enum';
import { RoleDto } from '../users/dto/role.dto';

// Mock user response data
const mockUserResponseDto = new UserResponseDto({
  _id: '507f1f77bcf86cd799439011',
  name: '陈辉',
  username: 'samchen',
  email: 'samchen@sinabuddy.com',
  phone: '13837147910',
  disableFlag: false,
  roles: [UserRole.ADMIN, UserRole.MANAGER],
  createdAt: new Date('2024-01-15T10:30:00.000Z'),
  updatedAt: new Date('2024-01-15T10:30:00.000Z'),
} as any);

const mockLoginResponse: LoginResponseDto = {
  accessToken: 'mock.jwt.token',
  tokenType: 'Bearer',
  expiresIn: 3600,
  user: mockUserResponseDto,
};

// Mock request object with user
const mockRequest = {
  user: {
    _id: '507f1f77bcf86cd799439011',
    name: '陈辉',
    username: 'samchen',
    email: 'samchen@sinabuddy.com',
    phone: '13837147910',
    disableFlag: false,
    roles: [new RoleDto(UserRole.ADMIN), new RoleDto(UserRole.MANAGER)],
  },
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'samchen',
      password: '123456',
    };

    it('should return login response for valid credentials', async () => {
      // Arrange
      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result).toBe(mockLoginResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Arrange
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('用户名或密码错误'));

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.login(loginDto)).rejects.toThrow(
        '用户名或密码错误',
      );
    });

    it('should throw UnauthorizedException for disabled account', async () => {
      // Arrange
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('账户已被禁用'));

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.login(loginDto)).rejects.toThrow('账户已被禁用');
    });
  });

  describe('getProfile', () => {
    it('should return user profile information', () => {
      // Act
      const result = controller.getProfile(mockRequest);

      // Assert
      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        name: '陈辉',
        username: 'samchen',
        email: 'samchen@sinabuddy.com',
        phone: '13837147910',
        disableFlag: false,
        roles: [new RoleDto(UserRole.ADMIN), new RoleDto(UserRole.MANAGER)],
      });
    });

    it('should handle undefined user ID', () => {
      // Arrange
      const requestWithoutId = {
        user: {
          name: '陈辉',
          username: 'samchen',
          email: 'samchen@sinabuddy.com',
          phone: '13837147910',
          disableFlag: false,
          roles: [new RoleDto(UserRole.ADMIN)],
        },
      };

      // Act
      const result = controller.getProfile(requestWithoutId);

      // Assert
      expect(result.id).toBe('undefined');
      expect(result.name).toBe('陈辉');
    });
  });

  describe('logout', () => {
    it('should return logout success message', () => {
      // Act
      const result = controller.logout();

      // Assert
      expect(result).toEqual({
        message: '登出成功，请在客户端清除令牌',
      });
    });
  });
});
