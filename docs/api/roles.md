# 权限管理 API 文档

## 概述

系统采用基于角色的权限控制（RBAC），提供6种预定义角色，分别对应不同的业务职能。

## 角色列表

### 1. 业务员 (SALES)

- **角色ID**: 1
- **描述**: 负责业务开发、客户维护和订单跟进等销售相关工作
- **主要职责**:
  - 客户信息查看和维护
  - 订单创建和状态跟踪
  - 基础报表查看
  - 个人业绩统计

### 2. 单证 (DOCUMENT)

- **角色ID**: 2
- **描述**: 负责单证制作、文件审核和报关报检等文档处理工作
- **主要职责**:
  - 单证文件制作和管理
  - 报关报检文档处理
  - 文件审核和归档

### 3. 海运 (SHIPPING)

- **角色ID**: 3
- **描述**: 负责海运订舱、船期安排和运输协调等物流运输工作
- **主要职责**:
  - 海运订舱管理
  - 船期安排和跟踪
  - 运输路线规划
  - 物流成本核算

### 4. 货源 (SUPPLY)

- **角色ID**: 4
- **描述**: 负责货源采购、供应商管理和库存协调等供应链工作
- **主要职责**:
  - 供应商信息管理
  - 采购订单处理
  - 库存监控和调配
  - 供应链成本分析

### 5. 经理 (MANAGER)

- **角色ID**: 5
- **描述**: 负责团队管理、业务监督和决策审批等中层管理工作
- **主要职责**:
  - 团队成员管理
  - 业务审批和监督
  - 部门报表和分析
  - 绩效考核管理

### 6. 管理员 (ADMIN)

- **角色ID**: 6
- **描述**: 系统最高权限角色，负责系统配置、用户管理和权限分配
- **主要职责**:
  - 系统配置和维护
  - 用户账户管理
  - 权限分配和调整
  - 全局数据查看和导出
  - 系统安全设置

## 数据模型

### 角色数据结构

| 字段名      | 类型    | 描述               | 示例                        |
| ----------- | ------- | ------------------ | --------------------------- |
| roleId      | number  | 角色ID（1-6）      | 1                           |
| name        | string  | 角色中文名称       | "业务员"                    |
| description | string  | 角色详细描述       | "负责业务开发、客户维护..." |
| isSystem    | boolean | 是否为系统内置角色 | true                        |
| createdAt   | Date    | 创建时间           | "2024-01-01T00:00:00Z"      |

### 角色枚举定义

```typescript
export enum UserRole {
  /** 业务员 */
  SALES = 1,
  /** 单证 */
  DOCUMENT = 2,
  /** 海运 */
  SHIPPING = 3,
  /** 货源 */
  SUPPLY = 4,
  /** 经理 */
  MANAGER = 5,
  /** 管理员 */
  ADMIN = 6,
}
```

## 初始化数据

### 数据库种子数据

系统提供了完整的角色初始化数据，包含6个预定义角色的详细信息。可以通过以下命令进行数据库初始化：

```bash
# 初始化角色数据
npm run seed

# 重置并重新初始化数据
npm run seed:reset

# 查看角色数据状态
npm run seed:status
```

### 初始化数据内容

```json
[
  {
    "roleId": 1,
    "name": "业务员",
    "description": "负责业务开发、客户维护和订单跟进等销售相关工作",
    "isSystem": true
  },
  {
    "roleId": 2,
    "name": "单证",
    "description": "负责单证制作、文件审核和报关报检等文档处理工作",
    "isSystem": true
  },
  {
    "roleId": 3,
    "name": "海运",
    "description": "负责海运订舱、船期安排和运输协调等物流运输工作",
    "isSystem": true
  },
  {
    "roleId": 4,
    "name": "货源",
    "description": "负责货源采购、供应商管理和库存协调等供应链工作",
    "isSystem": true
  },
  {
    "roleId": 5,
    "name": "经理",
    "description": "负责团队管理、业务监督和决策审批等中层管理工作",
    "isSystem": true
  },
  {
    "roleId": 6,
    "name": "管理员",
    "description": "系统最高权限角色，负责系统配置、用户管理和权限分配",
    "isSystem": true
  }
]
```

## 使用说明

### 角色工具函数

```typescript
import { UserRole, getRoleName, getAllRoles } from '@/common/enums/roles.enum';

// 获取角色名称
const roleName = getRoleName(UserRole.SALES); // "业务员"

// 获取所有角色
const allRoles = getAllRoles(); // [1, 2, 3, 4, 5, 6]
```

### 种子数据服务

```typescript
import { DatabaseSeedService } from '@/database/database-seed.service';

// 获取角色统计信息
const stats = seedService.getRoleStatistics();

// 检查是否已初始化
const isInitialized = await seedService.isRolesInitialized();

// 初始化所有数据
await seedService.seedAll();
```

## API 接口

### 注意事项

由于角色数据是系统预定义的枚举类型，**不需要**提供角色的 CRUD API 接口。角色信息通过以下方式获取：

1. **前端**: 直接使用角色枚举和工具函数
2. **后端**: 通过种子数据服务获取角色信息
3. **数据库**: 角色信息作为用户的属性字段存储

### 相关接口

角色信息通过用户管理接口间接操作：

- `GET /users` - 获取用户列表（包含角色信息）
- `GET /users/:id` - 获取单个用户（包含角色信息）
- `POST /users` - 创建用户（指定角色）
- `PATCH /users/:id` - 更新用户（可修改角色）

详细的用户管理接口请参考：[用户管理 API 文档](./users.md)

## 安全说明

1. **角色不可删除**: 所有系统角色均为内置角色，不可删除或修改
2. **最小权限原则**: 建议为用户分配满足工作需要的合适权限角色
3. **定期审核**: 建议定期审核用户角色分配，确保权限合理性

## 更新日志

- **2024-01-01**: 初始化6个系统角色
- **2024-01-01**: 添加角色种子数据和初始化脚本
- **2024-01-01**: 完善角色权限说明和使用文档
