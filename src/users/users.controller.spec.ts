/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoggerService } from '../logger/logger.service';
import { UserRole } from '../common/enums/roles.enum';
import { RoleDto } from './dto/role.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        phone: '13812345678',
        disableFlag: false,
        roles: [UserRole.SALES],
      };

      const mockResult: UserResponseDto = {
        id: '507f1f77bcf86cd799439011',
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '13812345678',
        disableFlag: false,
        roles: [new RoleDto(UserRole.SALES)],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers: UserResponseDto[] = [
        {
          id: '507f1f77bcf86cd799439011',
          name: 'Test User 1',
          username: 'testuser1',
          email: 'test1@example.com',
          phone: '13812345678',
          disableFlag: false,
          roles: [new RoleDto(UserRole.SALES)],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '507f1f77bcf86cd799439012',
          name: 'Test User 2',
          username: 'testuser2',
          email: 'test2@example.com',
          phone: '13812345679',
          disableFlag: false,
          roles: [new RoleDto(UserRole.SALES)],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser: UserResponseDto = {
        id: '507f1f77bcf86cd799439011',
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '13812345678',
        disableFlag: false,
        roles: [new RoleDto(UserRole.SALES)],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUsersService.findOne.mockRejectedValue(new NotFoundException());

      await expect(
        controller.findOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        disableFlag: true,
      };

      const mockUpdatedUser: UserResponseDto = {
        id: '507f1f77bcf86cd799439011',
        name: 'Updated User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '13812345678',
        disableFlag: true,
        roles: [new RoleDto(UserRole.SALES)],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(mockUpdatedUser);

      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        updateUserDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateUserDto,
      );
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('507f1f77bcf86cd799439011');

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toBeUndefined();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser: UserResponseDto = {
        id: '507f1f77bcf86cd799439011',
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '13812345678',
        disableFlag: false,
        roles: [new RoleDto(UserRole.SALES)],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await controller.findByEmail('test@example.com');

      expect(service.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await controller.findByEmail('nonexistent@example.com');

      expect(service.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const mockUser: UserResponseDto = {
        id: '507f1f77bcf86cd799439011',
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '13812345678',
        disableFlag: false,
        roles: [new RoleDto(UserRole.SALES)],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await controller.findByUsername('testuser');

      expect(service.findByUsername).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user does not exist', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      const result = await controller.findByUsername('nonexistent');

      expect(service.findByUsername).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });
  });
});
