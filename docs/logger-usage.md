# Logger模块使用说明

## 概述

本项目已集成完整的日志系统，包含以下功能：

- 自动记录所有API请求和响应
- 详细的参数和请求体打印
- 业务操作日志
- 错误日志记录
- 响应时间统计

## 日志功能

### 1. 自动API日志拦截器

系统会自动记录所有HTTP请求，包含：

- 请求方法 (GET, POST, PATCH, DELETE)
- 请求URL
- 路径参数 (params)
- 查询参数 (query)
- 请求体 (body)
- 响应状态码
- 响应时间
- 时间戳

### 2. 业务日志

每个API端点都增加了详细的业务日志，记录：

- 操作开始
- 关键业务信息
- 操作结果
- 用户ID、邮箱等关键数据

### 3. 错误日志

自动捕获和记录所有错误，包含：

- 错误消息
- 错误堆栈
- HTTP状态码
- 时间戳

## 使用示例

### 启动应用

```bash
npm run start:dev
```

### 测试API请求

```bash
# 健康检查
curl http://localhost:3000

# 获取所有用户
curl http://localhost:3000/users

# 创建用户
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }'

# 通过ID获取用户
curl http://localhost:3000/users/507f1f77bcf86cd799439011

# 通过邮箱查找用户
curl http://localhost:3000/users/email/test@example.com

# 通过用户名查找用户
curl http://localhost:3000/users/username/testuser

# 更新用户
curl -X PATCH http://localhost:3000/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated Name"
  }'

# 删除用户
curl -X DELETE http://localhost:3000/users/507f1f77bcf86cd799439011
```

## 日志输出示例

### API请求日志

```
[Nest] 22763  - 2025/08/25 10:02:38   DEBUG [UsersController.create] API Request: {
  "method": "POST",
  "url": "/users",
  "timestamp": "2025-08-25T02:02:38.123Z",
  "body": {
    "username": "testuser",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

### 业务日志

```
[Nest] 22763  - 2025/08/25 10:02:38     LOG [UsersController.create] Creating new user with email: test@example.com
[Nest] 22763  - 2025/08/25 10:02:38     LOG [UsersController.create] User created successfully with ID: 507f1f77bcf86cd799439011
```

### API响应日志

```
[Nest] 22763  - 2025/08/25 10:02:38   DEBUG [UsersController.create] API Response: {
  "method": "POST",
  "url": "/users",
  "statusCode": 201,
  "timestamp": "2025-08-25T02:02:38.156Z",
  "responseTime": "33ms"
}
```

### 错误日志

```
[Nest] 22763  - 2025/08/25 10:02:38   ERROR [UsersController.findOne] Error: {
  "message": "User with ID 507f1f77bcf86cd799439011 not found",
  "stack": "NotFoundException: User with ID 507f1f77bcf86cd799439011 not found...",
  "timestamp": "2025-08-25T02:02:38.123Z",
  "status": 404
}
```

## 配置说明

### 日志级别

在 `main.ts` 中配置了以下日志级别：

- error: 错误信息
- warn: 警告信息
- log: 一般信息
- debug: 调试信息
- verbose: 详细信息

### 自定义日志

在任何服务或控制器中都可以注入 `LoggerService` 来记录自定义日志：

```typescript
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class YourService {
  constructor(private readonly logger: LoggerService) {}

  someMethod() {
    this.logger.log('Custom log message', 'YourService.someMethod');
    this.logger.debug('Debug information', 'YourService.someMethod');
    this.logger.error('Error occurred', 'YourService.someMethod');
  }
}
```
