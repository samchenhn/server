import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoggerService } from '../logger/logger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // 为整个控制器添加JWT认证保护
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(
      `Creating new user with name: ${createUserDto.name} and email: ${createUserDto.email}`,
      'UsersController.create',
    );

    const result = await this.usersService.create(createUserDto);

    this.logger.log(
      `User created successfully with ID: ${result.id}`,
      'UsersController.create',
    );

    return result;
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Fetching all users', 'UsersController.findAll');

    const result = await this.usersService.findAll();

    this.logger.log(`Found ${result.length} users`, 'UsersController.findAll');

    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    this.logger.log(`Fetching user with ID: ${id}`, 'UsersController.findOne');

    const result = await this.usersService.findOne(id);

    this.logger.log(
      `User found: ${result.name} (${result.username})`,
      'UsersController.findOne',
    );

    return result;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    this.logger.log(`Updating user with ID: ${id}`, 'UsersController.update');

    const result = await this.usersService.update(id, updateUserDto);

    this.logger.log(
      `User updated successfully: ${result.name} (${result.username})`,
      'UsersController.update',
    );

    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting user with ID: ${id}`, 'UsersController.remove');

    await this.usersService.remove(id);

    this.logger.log(
      `User deleted successfully with ID: ${id}`,
      'UsersController.remove',
    );
  }

  @Get('email/:email')
  async findByEmail(
    @Param('email') email: string,
  ): Promise<UserResponseDto | null> {
    this.logger.log(
      `Searching user by email: ${email}`,
      'UsersController.findByEmail',
    );

    const result = await this.usersService.findByEmail(email);

    if (result) {
      this.logger.log(
        `User found by email: ${result.name} (${result.username})`,
        'UsersController.findByEmail',
      );
    } else {
      this.logger.log(
        `No user found with email: ${email}`,
        'UsersController.findByEmail',
      );
    }

    return result;
  }

  @Get('username/:username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<UserResponseDto | null> {
    this.logger.log(
      `Searching user by username: ${username}`,
      'UsersController.findByUsername',
    );

    const result = await this.usersService.findByUsername(username);

    if (result) {
      this.logger.log(
        `User found by username: ${result.name} (${result.email})`,
        'UsersController.findByUsername',
      );
    } else {
      this.logger.log(
        `No user found with username: ${username}`,
        'UsersController.findByUsername',
      );
    }

    return result;
  }
}
