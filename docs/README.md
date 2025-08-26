# 文档目录

本目录包含 Qoder Server 项目的完整文档。

## 📚 文档结构

### 快速开始

- [快速开始指南](./quick-start.md) - 项目安装、配置和基本使用

### 配置与部署

- [配置文档](./configuration.md) - 环境变量和应用配置
- [部署指南](./deployment.md) - Docker 和 PM2 部署方案

### API 文档

- [认证 API](./api/auth.md) - 用户登录和身份验证
- [用户管理 API](./api/users.md) - 用户CRUD操作
- [角色管理 API](./api/roles.md) - 角色和权限管理
- [用户管理后台 API](./api/users-admin.md) - 管理员用户操作

### 技术文档

- [认证模块总结](./auth-module-summary.md) - 认证系统架构
- [日志使用指南](./logger-usage.md) - 日志系统使用
- [测试和同步报告](./test-and-sync-report.md) - 测试策略和实施

## 🚀 重要配置信息

### 服务端口

- **默认端口**: 3200
- **API 根路径**: `/server`
- **健康检查**: `GET http://localhost:3200/server`

### 开发环境启动

```bash
# 使用默认端口 3200
npm run start:dev

# 使用自定义端口
PORT=3201 npm run start:dev
```

### 生产环境部署

```bash
# 构建应用
npm run build

# 启动生产版本
npm run start:prod
```

## 📋 API 概览

| 模块     | 路径前缀        | 认证要求 | 文档链接                   |
| -------- | --------------- | -------- | -------------------------- |
| 健康检查 | `/server`       | 无       | -                          |
| 用户认证 | `/server/auth`  | 部分     | [auth.md](./api/auth.md)   |
| 用户管理 | `/server/users` | JWT      | [users.md](./api/users.md) |
| 角色管理 | -               | JWT      | [roles.md](./api/roles.md) |

## 🔧 开发工具

### 代码质量

```bash
npm run lint          # ESLint 检查
npm run lint:fix      # 自动修复格式问题
```

### 测试

```bash
npm run test          # 单元测试
npm run test:e2e      # 端到端测试
npm run test:cov      # 测试覆盖率
```

## 📖 阅读指南

1. **新手开发者**: 从 [快速开始指南](./quick-start.md) 开始
2. **前端开发者**: 重点关注 [API 文档](./api/) 目录
3. **运维人员**: 查看 [部署指南](./deployment.md) 和 [配置文档](./configuration.md)
4. **测试人员**: 参考各 API 文档中的测试示例

## 🔄 文档更新

文档与代码同步更新，当API或配置发生变化时：

1. 优先更新对应的文档文件
2. 确保示例代码和配置的准确性
3. 更新版本号和变更日志
4. 通知前端团队相关变更

## 📞 获取帮助

如果文档中的信息不够详细或遇到问题：

1. 查看项目根目录的 [README.md](../README.md)
2. 检查相关的测试文件了解使用示例
3. 查看源代码中的注释和类型定义
