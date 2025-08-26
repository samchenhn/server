import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // 获取自定义logger服务
  const loggerService = app.get(LoggerService);

  // 设置全局API前缀
  app.setGlobalPrefix('server');

  // 应用全局日志拦截器
  app.useGlobalInterceptors(new LoggingInterceptor(loggerService));

  const port = process.env.PORT ?? 3200;
  await app.listen(port);

  loggerService.log(`Application is running on port ${port}`, 'Bootstrap');
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
