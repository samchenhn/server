import { Logger } from '@nestjs/common';
export declare class LoggerService extends Logger {
    logApiRequest(method: string, url: string, params?: any, body?: any, context?: string): void;
    logApiResponse(method: string, url: string, statusCode: number, responseTime?: number, context?: string): void;
    logError(error: any, context?: string): void;
}
