/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/roles.enum';
import { UserResponseDto } from '../users/dto/user-response.dto';

// Mock UserDocument with comparePassword method
const mockUserDocument = {
  _id: '507f1f77bcf86cd799439011',
  name: '陈辉',
  username: 'samchen',
  email: 'samchen@sinabuddy.com',
  phone: '13837147910',
  disableFlag: false,
  roles: [UserRole.ADMIN, UserRole.MANAGER],
  password: '$2b$12$hashedpassword',
  comparePassword: jest.fn(),
  createdAt: new Date('2024-01-15T10:30:00.000Z'),
  updatedAt: new Date('2024-01-15T10:30:00.000Z'),
} as unknown as UserDocument;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsernameForAuth: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'samchen',
      password: '123456',
    };

    it('should return login response with valid credentials', async () => {
      // Arrange
      const mockToken = 'mock.jwt.token';
      jest
        .spyOn(usersService, 'findByUsernameForAuth')
        .mockResolvedValue(mockUserDocument);
      jest.spyOn(mockUserDocument, 'comparePassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({
        accessToken: mockToken,
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: expect.any(UserResponseDto),
      });
      expect(usersService.findByUsernameForAuth).toHaveBeenCalledWith(
        'samchen',
      );
      expect(mockUserDocument.comparePassword).toHaveBeenCalledWith('123456');
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'samchen',
        sub: '507f1f77bcf86cd799439011',
      });
    });

    it('should throw UnauthorizedException for invalid username', async () => {
      // Arrange
      jest.spyOn(usersService, 'findByUsernameForAuth').mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow('用户名或密码错误');
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      // Arrange
      jest
        .spyOn(usersService, 'findByUsernameForAuth')
        .mockResolvedValue(mockUserDocument);
      jest.spyOn(mockUserDocument, 'comparePassword').mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow('用户名或密码错误');
    });

    it('should throw UnauthorizedException for disabled user', async () => {
      // Arrange
      const disabledUser = { ...mockUserDocument, disableFlag: true };
      jest
        .spyOn(usersService, 'findByUsernameForAuth')
        .mockResolvedValue(disabledUser as UserDocument);
      jest.spyOn(disabledUser, 'comparePassword').mockResolvedValue(true);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow('账户已被禁用');
    });
  });

  describe('validateUser', () => {
    it('should return user for valid credentials', async () => {
      // Arrange
      jest
        .spyOn(usersService, 'findByUsernameForAuth')
        .mockResolvedValue(mockUserDocument);
      jest.spyOn(mockUserDocument, 'comparePassword').mockResolvedValue(true);

      // Act
      const result = await service.validateUser('samchen', '123456');

      // Assert
      expect(result).toBe(mockUserDocument);
    });

    it('should return null for invalid username', async () => {
      // Arrange
      jest.spyOn(usersService, 'findByUsernameForAuth').mockResolvedValue(null);

      // Act
      const result = await service.validateUser('invaliduser', '123456');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      // Arrange
      jest
        .spyOn(usersService, 'findByUsernameForAuth')
        .mockResolvedValue(mockUserDocument);
      jest.spyOn(mockUserDocument, 'comparePassword').mockResolvedValue(false);

      // Act
      const result = await service.validateUser('samchen', 'wrongpassword');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when error occurs', async () => {
      // Arrange
      jest
        .spyOn(usersService, 'findByUsernameForAuth')
        .mockRejectedValue(new Error('数据库错误'));

      // Act
      const result = await service.validateUser('samchen', '123456');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('verifyToken', () => {
    it('should return payload for valid token', async () => {
      // Arrange
      const mockPayload = {
        username: 'samchen',
        sub: '507f1f77bcf86cd799439011',
        iat: 1234567890,
        exp: 1234571490,
      };
      jest.spyOn(jwtService, 'verify').mockReturnValue(mockPayload);

      // Act
      const result = await service.verifyToken('valid.jwt.token');

      // Assert
      expect(result).toBe(mockPayload);
      expect(jwtService.verify).toHaveBeenCalledWith('valid.jwt.token');
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      // Arrange
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('无效的令牌');
      });

      // Act & Assert
      await expect(service.verifyToken('invalid.token')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.verifyToken('invalid.token')).rejects.toThrow(
        '无效的令牌',
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new token for valid user', () => {
      // Arrange
      const mockToken = 'new.jwt.token';
      const user = { _id: '507f1f77bcf86cd799439011', username: 'samchen' };
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      // Act
      const result = service.refreshToken(user);

      // Assert
      expect(result).toBe(mockToken);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'samchen',
        sub: '507f1f77bcf86cd799439011',
      });
    });
  });
});
