import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    return new UserResponseDto(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new UserResponseDto(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // If password is being updated, hash it first
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? new UserResponseDto(user) : null;
  }

  async findByUsername(username: string): Promise<UserResponseDto | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user ? new UserResponseDto(user) : null;
  }

  // New method for authentication - returns the user document with password for comparison
  async findByUsernameForAuth(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  // Method to validate user credentials
  async validateUser(
    username: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.findByUsernameForAuth(username);
    if (user && (await user.comparePassword(password))) {
      return new UserResponseDto(user);
    }
    return null;
  }
}
