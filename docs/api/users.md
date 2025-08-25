# 用户管理 API 文档

## 概述

用户管理模块提供了完整的用户 CRUD 操作接口，包括用户的创建、查询、更新和删除功能。所有接口都遵循 RESTful 设计规范。

## 基础信息

- **基础路径**: `/server/users`
- **支持格式**: JSON
- **认证方式**: JWT Bearer Token（所有接口都需要认证）
- **权限要求**: 需要有效的JWT令牌

## API 接口

### 1. 创建用户

创建一个新用户。

**请求信息**

```
POST /server/users
Content-Type: application/json
Authorization: Bearer <access_token>
```

**请求参数**

| 参数名      | 类型     | 必填 | 描述     | 验证规则                         |
| ----------- | -------- | ---- | -------- | -------------------------------- |
| name        | string   | 是   | 姓名     | 中文姓名，不能为空               |
| username    | string   | 是   | 登陆名   | 最少6个字符，不能为空            |
| password    | string   | 是   | 登陆密码 | 最少6个字符，不能为空            |
| email       | string   | 是   | 邮箱地址 | 必须是有效的邮箱格式             |
| phone       | string   | 是   | 电话号码 | 11位必须是数字，符合电话格式     |
| disableFlag | boolean  | 是   | 禁用标志 | 布尔值，不能为空                 |
| roles       | role数组 | 是   | 角色列表 | 不能为空，一个用户可以有多个角色 |

**请求示例**

```json
{
  "name": "张三",
  "username": "zhangsan123",
  "password": "password123",
  "email": "zhangsan@example.com",
  "phone": "13812345678",
  "disableFlag": false,
  "roles": [1, 3]
}
```

**响应信息**

- **成功状态码**: `201 Created`
- **失败状态码**: `400 Bad Request`（验证失败）

**响应示例**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "张三",
  "username": "zhangsan123",
  "email": "zhangsan@example.com",
  "phone": "13812345678",
  "disableFlag": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. 获取所有用户

获取系统中所有用户的列表。

**请求信息**

```
GET /server/users
Authorization: Bearer <access_token>
```

**请求参数**
无

**响应信息**

- **成功状态码**: `200 OK`

**响应示例**

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "张三",
    "username": "zhangsan123",
    "email": "zhangsan@example.com",
    "phone": "13812345678",
    "disableFlag": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "李四",
    "username": "lisi456",
    "email": "lisi@example.com",
    "phone": "13987654321",
    "disableFlag": true,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

### 3. 根据ID获取用户

根据用户ID获取特定用户的详细信息。

**请求信息**

```
GET /server/users/:id
Authorization: Bearer <access_token>
```

**路径参数**

| 参数名 | 类型   | 必填 | 描述             |
| ------ | ------ | ---- | ---------------- |
| id     | string | 是   | 用户的唯一标识符 |

**响应信息**

- **成功状态码**: `200 OK`
- **失败状态码**: `404 Not Found`（用户不存在）

**响应示例**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "张三",
  "username": "zhangsan123",
  "email": "zhangsan@example.com",
  "phone": "13812345678",
  "disableFlag": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. 更新用户信息

更新指定用户的信息。

**请求信息**

```
PATCH /server/users/:id
Content-Type: application/json
Authorization: Bearer <access_token>
```

**路径参数**

| 参数名 | 类型   | 必填 | 描述             |
| ------ | ------ | ---- | ---------------- |
| id     | string | 是   | 用户的唯一标识符 |

**请求参数**

所有参数都是可选的，只需要传入需要更新的字段。

| 参数名      | 类型    | 必填 | 描述     | 验证规则                     |
| ----------- | ------- | ---- | -------- | ---------------------------- |
| name        | string  | 否   | 姓名     | 不能为空                     |
| username    | string  | 否   | 登陆名   | 最少6个字符                  |
| password    | string  | 否   | 登陆密码 | 最少6个字符                  |
| email       | string  | 否   | 邮箱地址 | 必须是有效的邮箱格式         |
| phone       | string  | 否   | 电话号码 | 11位必须是数字，符合电话格式 |
| disableFlag | boolean | 否   | 禁用标志 | 布尔值                       |

**请求示例**

```json
{
  "name": "张三丰",
  "disableFlag": true
}
```

**响应信息**

- **成功状态码**: `200 OK`
- **失败状态码**: `404 Not Found`（用户不存在）、`400 Bad Request`（验证失败）

**响应示例**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "张三丰",
  "username": "zhangsan123",
  "email": "zhangsan@example.com",
  "phone": "13812345678",
  "disableFlag": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:45:00.000Z"
}
```

### 5. 删除用户

删除指定的用户。

**请求信息**

```
DELETE /server/users/:id
Authorization: Bearer <access_token>
```

**路径参数**

| 参数名 | 类型   | 必填 | 描述             |
| ------ | ------ | ---- | ---------------- |
| id     | string | 是   | 用户的唯一标识符 |

**响应信息**

- **成功状态码**: `204 No Content`
- **失败状态码**: `404 Not Found`（用户不存在）、`401 Unauthorized`（认证失败）

**响应示例**
成功删除时返回空响应体。

### 6. 根据邮箱查找用户

根据邮箱地址查找用户。

**请求信息**

```
GET /server/users/email/:email
Authorization: Bearer <access_token>
```

**路径参数**

| 参数名 | 类型   | 必填 | 描述           |
| ------ | ------ | ---- | -------------- |
| email  | string | 是   | 用户的邮箱地址 |

**响应信息**

- **成功状态码**: `200 OK`
- **找不到用户时**: 返回 `null`

**响应示例**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "张三",
  "username": "zhangsan123",
  "email": "zhangsan@example.com",
  "phone": "13812345678",
  "disableFlag": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

或者当用户不存在时：

```json
null
```

### 7. 根据用户名查找用户

根据用户名查找用户。

**请求信息**

```
GET /server/users/username/:username
Authorization: Bearer <access_token>
```

**路径参数**

| 参数名   | 类型   | 必填 | 描述   |
| -------- | ------ | ---- | ------ |
| username | string | 是   | 用户名 |

**响应信息**

- **成功状态码**: `200 OK`
- **找不到用户时**: 返回 `null`

**响应示例**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "张三",
  "username": "zhangsan123",
  "email": "zhangsan@example.com",
  "phone": "13812345678",
  "disableFlag": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## 数据模型

### UserResponseDto

用户响应数据传输对象，包含用户的完整信息。

| 字段名      | 类型    | 描述             |
| ----------- | ------- | ---------------- |
| id          | string  | 用户的唯一标识符 |
| name        | string  | 用户姓名         |
| username    | string  | 登陆名           |
| email       | string  | 邮箱地址         |
| phone       | string  | 电话号码         |
| disableFlag | boolean | 禁用标志         |
| createdAt   | Date    | 创建时间         |
| updatedAt   | Date    | 最后更新时间     |

### CreateUserDto

创建用户请求数据传输对象。

| 字段名      | 类型    | 必填 | 验证规则                     | 描述     |
| ----------- | ------- | ---- | ---------------------------- | -------- |
| name        | string  | 是   | 不能为空                     | 用户姓名 |
| username    | string  | 是   | 最少6个字符，不能为空        | 登陆名   |
| password    | string  | 是   | 最少6个字符，不能为空        | 登陆密码 |
| email       | string  | 是   | 必须是有效的邮箱格式         | 邮箱地址 |
| phone       | string  | 是   | 11位必须是数字，符合电话格式 | 电话号码 |
| disableFlag | boolean | 是   | 布尔值，不能为空             | 禁用标志 |

### UpdateUserDto

更新用户请求数据传输对象，继承自 CreateUserDto，所有字段都是可选的。

| 字段名      | 类型    | 必填 | 验证规则                     | 描述     |
| ----------- | ------- | ---- | ---------------------------- | -------- |
| name        | string  | 否   | 不能为空                     | 用户姓名 |
| username    | string  | 否   | 最少6个字符                  | 登陆名   |
| password    | string  | 否   | 最少6个字符                  | 登陆密码 |
| email       | string  | 否   | 必须是有效的邮箱格式         | 邮箱地址 |
| phone       | string  | 否   | 11位必须是数字，符合电话格式 | 电话号码 |
| disableFlag | boolean | 否   | 布尔值                       | 禁用标志 |

## 错误处理

### 常见错误响应

#### 400 Bad Request - 验证失败

```json
{
  "statusCode": 400,
  "message": [
    "username must be longer than or equal to 6 characters",
    "email must be an email",
    "phone must be a valid Chinese mobile number"
  ],
  "error": "Bad Request"
}
```

#### 404 Not Found - 资源不存在

```json
{
  "statusCode": 404,
  "message": "User with ID 507f1f77bcf86cd799439011 not found",
  "error": "Not Found"
}
```

#### 500 Internal Server Error - 服务器内部错误

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## 日志记录

用户管理模块集成了完整的日志记录功能，会自动记录：

- **请求日志**: 记录每个API请求的方法、URL、参数和请求体
- **响应日志**: 记录响应状态码、响应时间
- **业务日志**: 记录关键业务操作，如用户创建、更新、删除等
- **错误日志**: 记录异常信息和错误堆栈

所有日志都包含请求时间戳和控制器方法信息，便于问题定位和性能分析。

## 使用示例

### 创建并查询用户的完整流程

```bash
# 0. 先登录获取JWT令牌
export TOKEN=$(curl -s -X POST http://localhost:3000/server/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "samchen", "password": "123456"}' | \
  jq -r '.accessToken')

# 1. 创建用户
curl -X POST http://localhost:3000/server/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "测试用户",
    "username": "testuser123",
    "password": "testpass123",
    "email": "test@example.com",
    "phone": "13812345678",
    "disableFlag": false,
    "roles": [1, 2]
  }'

# 2. 获取所有用户
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/server/users

# 3. 根据邮箱查找用户
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/server/users/email/test@example.com

# 4. 更新用户信息
curl -X PATCH http://localhost:3000/server/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "更新测试用户",
    "disableFlag": true
  }'

# 5. 删除用户
curl -X DELETE http://localhost:3000/server/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN"
```

## 注意事项

1. **认证要求**: 所有用户管理API都需要JWT令牌认证，请先通过登录接口获取令牌
2. **数据验证**: 所有输入数据都会经过严格的验证，确保数据完整性和安全性
3. **唯一性约束**: 用户名和邮箱必须在系统中保持唯一
4. **密码安全**: 密码字段在响应中不会返回，并使用bcrypt进行加密存储
5. **电话格式**: 电话号码必须符合中国大陆手机号格式（1开头，11位数字）
6. **软删除**: 目前实现的是硬删除，后续可能会改为软删除以保留数据历史
7. **分页**: 当前的获取所有用户接口没有分页功能，在用户量大的情况下可能需要添加分页支持
8. **角色管理**: 用户创建时需要指定角色，角色ID对应角色管理系统中的角色

## 版本历史

- **v2.0.0**: 更新版本，修改用户表结构
  - 新增 `name`、`password`、`phone`、`disableFlag` 字段
  - 移除 `firstName`、`lastName`、`isActive` 字段
  - 更新验证规则，username最小长度改为6个字符
  - 添加中国手机号验证
- **v1.0.0**: 初始版本，提供基础的用户CRUD功能
  - 创建、查询、更新、删除用户
  - 根据邮箱和用户名查找用户
  - 完整的数据验证和日志记录
