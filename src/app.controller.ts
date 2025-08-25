import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard) // 为健康检查端点添加JWT认证保护
  getHello(): string {
    this.logger.log('Health check endpoint accessed', 'AppController.getHello');
    return this.appService.getHello();
  }
}
