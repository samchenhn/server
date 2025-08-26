# 部署指南

## 概述

本文档提供了在不同环境中部署 NestJS 应用的详细指南，包括 Docker 容器化部署和 PM2 进程管理部署。

**重要**: 应用默认运行在端口 **3200**，请确保部署配置与此保持一致。

## Docker 部署

### Dockerfile 示例

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine AS runner

WORKDIR /app

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# 复制构建产物和依赖
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 创建日志目录
RUN mkdir -p /app/logs && chown -R nestjs:nodejs /app/logs

USER nestjs

# 暴露端口 3200
EXPOSE 3200

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3200

# 启动应用
CMD ["node", "dist/main.js"]
```

### Docker Compose 配置

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: qoder-server
    ports:
      - '3200:3200' # 主机端口:容器端口
    environment:
      - NODE_ENV=production
      - PORT=3200
      - MONGODB_URI=mongodb://mongodb:27017/qoder-server
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./logs:/app/logs
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    restart: unless-stopped
    depends_on:
      - mongodb
    networks:
      - app-network

  mongodb:
    image: mongo:6-jammy
    container_name: qoder-mongodb
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    ports:
      - '27017:27017'
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: qoder-nginx
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

### Nginx 反向代理配置

```nginx
upstream qoder_server {
    server app:3200;  # 指向容器内的端口 3200
}

server {
    listen 80;
    server_name your-domain.com;

    location /server {
        proxy_pass http://qoder_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

### Docker 部署命令

```bash
# 1. 构建镜像
docker build -t qoder-server:latest .

# 2. 创建并启动容器
docker run -d \
  --name qoder-server \
  -p 3200:3200 \
  -e NODE_ENV=production \
  -e PORT=3200 \
  -e MONGODB_URI=mongodb://localhost:27017/qoder-server \
  -v $(pwd)/logs:/app/logs \
  qoder-server:latest

# 3. 使用 Docker Compose
docker-compose up -d

# 4. 查看运行状态
docker-compose ps
docker-compose logs app
```

## PM2 部署

### ecosystem.config.js 配置

```javascript
module.exports = {
  apps: [
    {
      name: 'qoder-server',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3200, // 设置端口为 3200
        MONGODB_URI: 'mongodb://localhost:27017/qoder-server',
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3200,
        MONGODB_URI: 'mongodb://localhost:27017/qoder-server-dev',
      },
      env_testing: {
        NODE_ENV: 'testing',
        PORT: 3201, // 测试环境可以使用不同端口
        MONGODB_URI: 'mongodb://localhost:27017/qoder-server-test',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-output.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/qoder-server.git',
      path: '/var/www/qoder-server',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
        PORT: 3200,
      },
    },
  },
};
```

### PM2 部署命令

```bash
# 1. 安装 PM2（如果未安装）
npm install -g pm2

# 2. 构建应用
npm run build

# 3. 启动应用
pm2 start ecosystem.config.js --env production

# 4. 保存 PM2 配置
pm2 save

# 5. 设置开机自启
pm2 startup

# 6. 常用管理命令
pm2 list                    # 查看所有进程
pm2 show qoder-server      # 查看应用详情
pm2 logs qoder-server      # 查看日志
pm2 restart qoder-server   # 重启应用
pm2 reload qoder-server    # 优雅重启
pm2 stop qoder-server      # 停止应用
pm2 delete qoder-server    # 删除应用

# 7. 监控
pm2 monit                  # 实时监控
```

## 健康检查

### 应用健康检查

```bash
# 检查应用是否正常运行
curl -f http://localhost:3200/server || exit 1

# 检查特定API端点
curl -f http://localhost:3200/server/users
```

### Docker 健康检查

在 Dockerfile 中添加健康检查：

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3200/server || exit 1
```

### PM2 健康监控

```javascript
// 在 ecosystem.config.js 中添加
module.exports = {
  apps: [
    {
      // ... 其他配置
      health_check_url: 'http://localhost:3200/server',
      health_check_grace_period: 3000,
    },
  ],
};
```

## 性能优化

### 生产环境优化

```bash
# 环境变量设置
export NODE_ENV=production
export PORT=3200

# 启用 gzip 压缩（Nginx）
gzip on;
gzip_types text/plain application/json application/javascript text/css;

# 设置适当的进程数（PM2）
instances: 'max'  # 或具体数字，如 4
```

### 监控和日志

```bash
# PM2 监控
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

# Docker 日志轮转
docker run --log-driver=json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  qoder-server:latest
```

## 故障排除

### 常见问题

1. **端口占用**

   ```bash
   # 检查端口占用
   netstat -tulpn | grep 3200
   lsof -i :3200

   # 强制释放端口
   fuser -k 3200/tcp
   ```

2. **权限问题**

   ```bash
   # 检查文件权限
   ls -la /app/logs

   # 修复权限
   chown -R app:app /app/logs
   ```

3. **内存不足**

   ```bash
   # PM2 设置内存限制
   max_memory_restart: '1G'

   # Docker 设置内存限制
   docker run --memory=1g qoder-server:latest
   ```

## 安全建议

1. **环境变量**: 使用 `.env` 文件管理敏感信息，不要提交到版本控制
2. **防火墙**: 只开放必要的端口（3200、80、443）
3. **SSL/TLS**: 生产环境使用 HTTPS
4. **用户权限**: 使用非 root 用户运行应用
5. **镜像安全**: 定期更新基础镜像，扫描安全漏洞
