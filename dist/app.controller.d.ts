import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
export declare class AppController {
    private readonly appService;
    private readonly logger;
    constructor(appService: AppService, logger: LoggerService);
    getHello(): string;
}
