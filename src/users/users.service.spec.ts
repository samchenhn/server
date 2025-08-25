import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

// Mock bcrypt module
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    username: 'testuser',
    password: '$2b$12$hashedpassword',
    email: 'test@example.com',
    phone: '13812345678',
    disableFlag: false,
    roles: [UserRole.SALES],
    createdAt: new Date(),
    updatedAt: new Date(),
    comparePassword: jest.fn(),
  };

  // Create a properly typed mock for Mongoose Model
  const mockUserModel = {
    findById: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
  } as unknown as Model<UserDocument>;

  // Mock constructor function that returns an object with save method
  const MockUserModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...mockUser, ...dto }),
  }));

  // Add static methods to the constructor
  Object.assign(MockUserModel, mockUserModel);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.username).toBe(createUserDto.username);
      expect(result.email).toBe(createUserDto.email);
      expect(result.name).toBe(createUserDto.name);
      expect(result.phone).toBe(createUserDto.phone);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      (MockUserModel as any).find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await service.findAll();

      expect((MockUserModel as any).find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe(mockUser.username);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      (MockUserModel as any).findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect((MockUserModel as any).findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(result.username).toBe(mockUser.username);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      (MockUserModel as any).findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        disableFlag: true,
      };

      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
      };

      (MockUserModel as any).findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateUserDto,
      );

      expect((MockUserModel as any).findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateUserDto,
        { new: true },
      );
      expect(result.name).toBe('Updated User');
      expect(result.disableFlag).toBe(true);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      (MockUserModel as any).findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('507f1f77bcf86cd799439011', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      (MockUserModel as any).findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await service.remove('507f1f77bcf86cd799439011');

      expect((MockUserModel as any).findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      (MockUserModel as any).findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByEmail('test@example.com');

      expect((MockUserModel as any).findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null when user does not exist', async () => {
      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByUsername('testuser');

      expect((MockUserModel as any).findOne).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(result?.username).toBe('testuser');
    });

    it('should return null when user does not exist', async () => {
      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findByUsername('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('password encryption and validation', () => {
    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();
    });

    it('should hash password when updating user with new password', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'newpassword123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$12$newhash');

      const updatedUser = {
        ...mockUser,
        password: '$2b$12$newhash',
      };

      (MockUserModel as any).findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateUserDto,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 12);
      expect((MockUserModel as any).findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { password: '$2b$12$newhash' },
        { new: true },
      );
      expect(result).toBeDefined();
    });

    it('should not hash password when updating user without password', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const updatedUser = {
        ...mockUser,
        name: 'Updated Name',
      };

      (MockUserModel as any).findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      await service.update('507f1f77bcf86cd799439011', updateUserDto);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect((MockUserModel as any).findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateUserDto,
        { new: true },
      );
    });
  });

  describe('findByUsernameForAuth', () => {
    it('should return user document for authentication', async () => {
      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByUsernameForAuth('testuser');

      expect((MockUserModel as any).findOne).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(result).toBe(mockUser);
    });

    it('should return null when user does not exist', async () => {
      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findByUsernameForAuth('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUserWithCompare = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUserWithCompare),
      });

      const result = await service.validateUser('testuser', 'password123');

      expect(mockUserWithCompare.comparePassword).toHaveBeenCalledWith(
        'password123',
      );
      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
    });

    it('should return null when password is invalid', async () => {
      const mockUserWithCompare = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUserWithCompare),
      });

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(mockUserWithCompare.comparePassword).toHaveBeenCalledWith(
        'wrongpassword',
      );
      expect(result).toBeNull();
    });

    it('should return null when user does not exist', async () => {
      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.validateUser('nonexistent', 'password123');
      expect(result).toBeNull();
    });
  });
});
