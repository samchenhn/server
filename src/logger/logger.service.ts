import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  /**
   * 记录API请求的debug日志
   * @param method HTTP方法
   * @param url 请求URL
   * @param params 请求参数
   * @param body 请求体
   * @param context 上下文（通常是控制器名称）
   */
  logApiRequest(
    method: string,
    url: string,
    params?: any,
    body?: any,
    context?: string,
  ): void {
    const logData = {
      method,
      url,
      timestamp: new Date().toISOString(),
      ...(params &&
        typeof params === 'object' &&
        params !== null &&
        Object.keys(params as Record<string, any>).length > 0 && { params }),
      ...(body &&
        typeof body === 'object' &&
        body !== null &&
        Object.keys(body as Record<string, any>).length > 0 && { body }),
    };

    this.debug(
      `API Request: ${JSON.stringify(logData, null, 2)}`,
      context || 'ApiRequest',
    );
  }

  /**
   * 记录API响应的debug日志
   * @param method HTTP方法
   * @param url 请求URL
   * @param statusCode 响应状态码
   * @param responseTime 响应时间（毫秒）
   * @param context 上下文
   */
  logApiResponse(
    method: string,
    url: string,
    statusCode: number,
    responseTime?: number,
    context?: string,
  ): void {
    const logData = {
      method,
      url,
      statusCode,
      timestamp: new Date().toISOString(),
      ...(responseTime && { responseTime: `${responseTime}ms` }),
    };

    this.debug(
      `API Response: ${JSON.stringify(logData, null, 2)}`,
      context || 'ApiResponse',
    );
  }

  /**
   * 记录错误日志
   * @param error 错误对象
   * @param context 上下文
   */
  logError(error: any, context?: string): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...(error.status && { status: error.status }),
    };

    this.error(
      `Error: ${JSON.stringify(errorData, null, 2)}`,
      error.stack,
      context || 'Error',
    );
  }
}
