"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const logging_interceptor_1 = require("./logger/logging.interceptor");
const logger_service_1 = require("./logger/logger.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const loggerService = app.get(logger_service_1.LoggerService);
    app.setGlobalPrefix('server');
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(loggerService));
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    loggerService.log(`Application is running on port ${port}`, 'Bootstrap');
}
bootstrap().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map