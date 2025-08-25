import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, params, query, body } = request;
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;

    // 合并params和query参数
    const allParams = { ...params, ...query };

    // 确保method和url为字符串类型
    const httpMethod = method as string;
    const requestUrl = url as string;

    // 记录请求日志
    this.loggerService.logApiRequest(
      httpMethod,
      requestUrl,
      allParams,
      body,
      `${controllerName}.${handlerName}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;
          // 记录响应日志
          this.loggerService.logApiResponse(
            httpMethod,
            requestUrl,
            response.statusCode as number,
            responseTime,
            `${controllerName}.${handlerName}`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          // 记录错误日志
          this.loggerService.logError(
            error,
            `${controllerName}.${handlerName}`,
          );
          this.loggerService.logApiResponse(
            httpMethod,
            requestUrl,
            error.status != null && typeof error.status === 'number'
              ? error.status
              : 500,
            responseTime,
            `${controllerName}.${handlerName}`,
          );
        },
      }),
    );
  }
}
