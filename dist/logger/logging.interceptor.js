"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const logger_service_1 = require("./logger.service");
let LoggingInterceptor = class LoggingInterceptor {
    loggerService;
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    intercept(context, next) {
        const startTime = Date.now();
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, params, query, body } = request;
        const controllerName = context.getClass().name;
        const handlerName = context.getHandler().name;
        const allParams = { ...params, ...query };
        const httpMethod = method;
        const requestUrl = url;
        this.loggerService.logApiRequest(httpMethod, requestUrl, allParams, body, `${controllerName}.${handlerName}`);
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const responseTime = Date.now() - startTime;
                this.loggerService.logApiResponse(httpMethod, requestUrl, response.statusCode, responseTime, `${controllerName}.${handlerName}`);
            },
            error: (error) => {
                const responseTime = Date.now() - startTime;
                this.loggerService.logError(error, `${controllerName}.${handlerName}`);
                this.loggerService.logApiResponse(httpMethod, requestUrl, error.status != null && typeof error.status === 'number'
                    ? error.status
                    : 500, responseTime, `${controllerName}.${handlerName}`);
            },
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map