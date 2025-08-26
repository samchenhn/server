# 配置文档

## 环境变量配置

### 服务端口配置

| 环境变量 | 默认值 | 说明           |
| -------- | ------ | -------------- |
| `PORT`   | `3200` | 服务器监听端口 |

#### 配置示例

```bash
# 使用默认端口 3200
npm run start:dev

# 使用自定义端口
PORT=3201 npm run start:dev
PORT=8080 npm run start:prod
```

#### main.ts 中的实现

```typescript
const port = process.env.PORT ?? 3200;
await app.listen(port);
loggerService.log(`Application is running on port ${port}`, 'Bootstrap');
```

### 应用配置

| 配置项      | 值                                             | 说明              |
| ----------- | ---------------------------------------------- | ----------------- |
| 全局API前缀 | `/server`                                      | 所有API路由的前缀 |
| 日志级别    | `['error', 'warn', 'log', 'debug', 'verbose']` | 应用日志级别      |

### 数据库配置

目前项目支持 MongoDB 数据库连接，相关配置需要在环境变量中设置：

```bash
# MongoDB 连接示例（需要根据实际情况配置）
MONGODB_URI=mongodb://localhost:27017/qoder-server
```

## 开发环境配置

### .env 文件示例

创建 `.env` 文件用于本地开发：

```env
# 服务端口
PORT=3200

# 数据库连接
MONGODB_URI=mongodb://localhost:27017/qoder-server-dev

# JWT 密钥（生产环境请使用安全的随机字符串）
JWT_SECRET=your-jwt-secret-key

# 应用环境
NODE_ENV=development
```

### 生产环境配置

```env
# 服务端口
PORT=3200

# 数据库连接
MONGODB_URI=mongodb://your-production-host:27017/qoder-server

# JWT 密钥
JWT_SECRET=your-secure-jwt-secret-key

# 应用环境
NODE_ENV=production
```

## 常见配置问题

### 端口占用

**问题**: 启动时出现 `EADDRINUSE` 错误

**解决方案**:

1. 使用不同端口启动：

   ```bash
   PORT=3201 npm run start:dev
   ```

2. 查找并终止占用进程：

   ```bash
   # 查找占用端口的进程
   lsof -ti:3200

   # 终止进程（替换 <PID> 为实际进程ID）
   kill -9 <PID>
   ```

### 环境变量加载

**问题**: 环境变量未生效

**解决方案**:

1. 确认 `.env` 文件位于项目根目录
2. 重启开发服务器
3. 检查环境变量格式是否正确（无空格、正确的等号分隔）

### 配置验证

可以通过以下方式验证配置是否正确：

```bash
# 检查服务器启动日志
npm run start:dev

# 查看应用运行端口
curl http://localhost:3200/server
```

## 配置最佳实践

1. **环境隔离**: 为不同环境（开发、测试、生产）使用不同的配置文件
2. **密钥安全**: 生产环境中的敏感信息（JWT密钥、数据库密码）应通过安全的方式管理
3. **配置验证**: 应用启动时验证必要的环境变量是否存在
4. **默认值**: 为非敏感配置提供合理的默认值，如端口号
5. **文档同步**: 配置变更时及时更新文档
