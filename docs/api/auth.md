# 认证管理 API 文档

## 概述

认证管理模块提供了完整的用户认证和授权功能，包括用户登录、JWT令牌管理和用户信息获取。所有接口都遵循 RESTful 设计规范和JWT认证标准。

## 基础信息

- **基础路径**: `/server/auth`
- **支持格式**: JSON
- **认证方式**: JWT Bearer Token（除登录接口外）
- **令牌有效期**: 3600秒（1小时）

## 数据模型

### LoginDto（登录请求）

```typescript
interface LoginDto {
  username: string; // 用户名，最少6个字符
  password: string; // 密码，最少6个字符
}
```

### LoginResponseDto（登录响应）

```typescript
interface LoginResponseDto {
  accessToken: string; // JWT访问令牌
  tokenType: 'Bearer'; // 令牌类型
  expiresIn: number; // 过期时间（秒）
  user: UserResponseDto; // 用户信息
}
```

### UserResponseDto（用户信息）

```typescript
interface UserResponseDto {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  disableFlag: boolean;
  roles: RoleDto[];
  createdAt: string;
  updatedAt: string;
}
```

### RoleDto（角色信息）

```typescript
interface RoleDto {
  roleId: number;
  name: string;
}
```

## API 接口

### 1. 用户登录

用户通过用户名和密码进行身份验证，获取JWT访问令牌。

**请求信息**

```
POST /server/auth/login
Content-Type: application/json
```

**请求参数**

| 参数名   | 类型   | 必填 | 描述   | 验证规则    |
| -------- | ------ | ---- | ------ | ----------- |
| username | string | 是   | 用户名 | 最少6个字符 |
| password | string | 是   | 密码   | 最少6个字符 |

**请求示例**

```json
{
  "username": "samchen",
  "password": "123456"
}
```

**响应信息**

- **成功状态码**: `200 OK`
- **失败状态码**: `401 Unauthorized`（用户名或密码错误、账户被禁用）

**成功响应示例**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbWNoZW4iLCJzdWIiOiI2OGFjMTU3ODkyYzRlN2Q1ODFkODAyZjEiLCJpYXQiOjE3NTYxMDg4NzcsImV4cCI6MTc1NjExMjQ3N30.pkOFisRmDvxraujQPdn0Zz3cf31juKC0mu2khN65UnQ",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "68ac157892c4e7d581d802f1",
    "name": "陈辉",
    "username": "samchen",
    "email": "samchen@sinabuddy.com",
    "phone": "13837147910",
    "disableFlag": false,
    "roles": [
      { "roleId": 1, "name": "业务员" },
      { "roleId": 2, "name": "单证" },
      { "roleId": 3, "name": "海运" },
      { "roleId": 4, "name": "货源" },
      { "roleId": 5, "name": "经理" },
      { "roleId": 6, "name": "管理员" }
    ],
    "createdAt": "2025-08-25T07:49:12.065Z",
    "updatedAt": "2025-08-25T07:49:12.065Z"
  }
}
```

**错误响应示例**

```json
{
  "message": "用户名或密码错误",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 2. 获取当前用户信息

获取当前登录用户的详细信息（需要JWT认证）。

**请求信息**

```
GET /server/auth/profile
Authorization: Bearer <access_token>
```

**请求参数**
无

**响应信息**

- **成功状态码**: `200 OK`
- **失败状态码**: `401 Unauthorized`（令牌无效或过期）

**成功响应示例**

```json
{
  "id": "68ac157892c4e7d581d802f1",
  "name": "陈辉",
  "username": "samchen",
  "email": "samchen@sinabuddy.com",
  "phone": "13837147910",
  "disableFlag": false,
  "roles": [
    { "roleId": 1, "name": "业务员" },
    { "roleId": 2, "name": "单证" },
    { "roleId": 3, "name": "海运" },
    { "roleId": 4, "name": "货源" },
    { "roleId": 5, "name": "经理" },
    { "roleId": 6, "name": "管理员" }
  ]
}
```

### 3. 用户登出

用户登出（清除客户端令牌，需要JWT认证）。

**请求信息**

```
POST /server/auth/logout
Authorization: Bearer <access_token>
```

**请求参数**
无

**响应信息**

- **成功状态码**: `200 OK`
- **失败状态码**: `401 Unauthorized`（令牌无效或过期）

**成功响应示例**

```json
{
  "message": "登出成功，请在客户端清除令牌"
}
```

## 错误处理

### 常见错误状态码

| 状态码 | 错误类型       | 描述                                 |
| ------ | -------------- | ------------------------------------ |
| 400    | Bad Request    | 请求参数验证失败                     |
| 401    | Unauthorized   | 认证失败（用户名密码错误、令牌无效） |
| 500    | Internal Error | 服务器内部错误                       |

### 错误响应格式

```json
{
  "message": "错误描述信息",
  "error": "错误类型",
  "statusCode": 错误状态码
}
```

## 安全特性

### 密码安全

- 使用bcrypt进行密码哈希加密（cost因子12）
- 密码不会在响应中返回
- 支持密码复杂度验证

### JWT令牌安全

- 使用HS256算法签名
- 令牌包含用户标识和过期时间
- 支持令牌黑名单机制（客户端登出时清除）

### 权限控制

- 基于JWT令牌的身份验证
- 集成角色权限系统
- 支持路由级别的访问控制

## cURL 使用示例

### 登录获取令牌

```bash
curl -X POST http://localhost:3000/server/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "samchen",
    "password": "123456"
  }'
```

### 获取用户信息

```bash
curl -X GET http://localhost:3000/server/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 用户登出

```bash
curl -X POST http://localhost:3000/server/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 集成指南

### 前端集成

1. 登录后保存accessToken到localStorage或sessionStorage
2. 在后续API请求的Authorization头中携带令牌
3. 监听401状态码，自动跳转到登录页面
4. 登出时清除本地存储的令牌

### 令牌刷新

当前版本使用短期令牌机制，建议：

- 监控令牌过期时间
- 在令牌即将过期时提醒用户重新登录
- 未来版本将支持refresh token机制

## 系统管理员账户

系统预置管理员账户：

- **用户名**: samchen
- **密码**: 123456
- **角色**: 拥有所有系统权限
- **状态**: 启用

> 注意：生产环境中请及时修改默认密码
