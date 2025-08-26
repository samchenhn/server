# 快速开始指南

## 概述

本项目是一个基于 NestJS 框架的 TypeScript 服务端应用，提供用户管理、认证授权等核心功能。

## 环境要求

- **Node.js**: v18+ 或 v20+
- **npm**: 包管理器
- **MongoDB**: 数据库（可选，用于数据持久化）

## 安装依赖

```bash
npm install
```

## 开发环境启动

### 默认配置启动

服务器默认运行在 **端口 3200**：

```bash
npm run start:dev
```

启动成功后，服务器将在 `http://localhost:3200` 运行，API 根路径为 `/server`。

### 自定义端口启动

如果需要使用其他端口，可以通过环境变量指定：

```bash
PORT=3201 npm run start:dev
```

### 验证启动状态

启动成功后可以访问以下接口验证：

```bash
# 健康检查
curl http://localhost:3200/server

# 查看所有可用路由
curl http://localhost:3200/server/users
```

## 主要API接口

| 功能         | 方法 | 路径                 | 说明         |
| ------------ | ---- | -------------------- | ------------ |
| 健康检查     | GET  | `/server`            | 基本状态检查 |
| 用户登录     | POST | `/server/auth/login` | 用户认证登录 |
| 获取用户列表 | GET  | `/server/users`      | 需要JWT认证  |
| 创建用户     | POST | `/server/users`      | 需要JWT认证  |

## 开发工具

### 代码格式化

```bash
# 检查代码格式
npm run lint

# 自动修复格式问题
npm run lint:fix
```

### 运行测试

```bash
# 单元测试
npm run test

# 端到端测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

## 生产环境构建

```bash
# 构建项目
npm run build

# 启动生产版本
npm run start:prod
```

## 下一步

- 查看 [API 文档](./api/) 了解详细的接口说明
- 查看 [配置文档](./configuration.md) 了解环境变量配置
- 查看 [部署指南](./deployment.md) 了解生产环境部署
