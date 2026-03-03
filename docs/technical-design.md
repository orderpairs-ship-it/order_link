# 技术方案设计 - 订单转换助手

**版本:** 1.0  
**日期:** 2026-03-03  
**负责人:** Backend + Frontend

---

## 1. 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    用户界面 (Frontend)                   │
│  Electron / 浏览器扩展 + React/Vue                       │
├─────────────────────────────────────────────────────────┤
│                    本地服务 (Backend)                    │
│  Node.js + TypeScript                                    │
├──────────────┬──────────────────────────────────────────┤
│   爬虫模块   │   映射引擎    │   认证模块   │   数据层   │
│  Playwright  │   规则引擎    │   加密存储   │   SQLite   │
└──────────────┴──────────────────────────────────────────┘
```

---

## 2. 技术选型

### 2.1 前端

| 项目 | 选择 | 理由 |
|------|------|------|
| **应用形态** | Electron | 桌面应用，本地运行，跨平台 |
| **框架** | React + TypeScript | 团队熟悉，生态好 |
| **状态管理** | Zustand | 轻量，简单 |
| **UI 组件** | Ant Design / Chakra UI | 快速搭建，专业外观 |
| **构建工具** | Vite | 快速开发体验 |

### 2.2 后端

| 项目 | 选择 | 理由 |
|------|------|------|
| **运行时** | Node.js + TypeScript | 前后端统一语言 |
| **Web 框架** | Express.js | 简单，够用 |
| **数据库** | SQLite | 本地单文件，零配置 |
| **ORM** | Drizzle / Prisma | 类型安全 |
| **爬虫** | Playwright | 支持验证码，稳定 |
| **加密** | crypto-js | 轻量，够用 |

### 2.3 部署

| 项目 | 选择 | 理由 |
|------|------|------|
| **打包** | electron-builder | 跨平台打包 |
| **分发** | 内部下载 / 私有渠道 | 不需要公开商店 |

---

## 3. 目录结构

```
order_link/
├── frontend/                 # 前端代码
│   ├── src/
│   │   ├── components/       # UI 组件
│   │   ├── pages/            # 页面
│   │   ├── stores/           # 状态管理
│   │   ├── services/         # API 调用
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # 后端代码
│   ├── src/
│   │   ├── api/              # REST API
│   │   ├── crawler/          # 爬虫模块
│   │   ├── mapper/           # 映射引擎
│   │   ├── auth/             # 认证/加密
│   │   ├── db/               # 数据库
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                     # 文档
└── package.json              # Monorepo 根配置
```

---

## 4. 核心模块设计

### 4.1 爬虫模块 (Crawler)

```typescript
interface Crawler {
  // 登录（处理短信验证码）
  login(credentials: Credentials, smsCode?: string): Promise<Session>
  
  // 抓取订单
  fetchOrders(session: Session, filters?: Filter): Promise<ExternalOrder[]>
  
  // 登出
  logout(session: Session): Promise<void>
}

// 客户系统配置（可热更新）
interface CustomerConfig {
  id: string
  name: string
  loginUrl: string
  orderListUrl: string
  selectors: {
    username: string
    password: string
    smsCode: string
    orderRow: string
    // ...
  }
}
```

### 4.2 映射引擎 (Mapper)

```typescript
interface Mapper {
  // 字段映射
  mapFields(external: ExternalOrder, rules: FieldMapping[]): Promise<InternalOrder>
  
  // 物料映射
  mapMaterial(externalSku: string): Promise<InternalSku | null>
  
  // 学习新映射
  learnMapping(external: string, internal: string): Promise<void>
}

interface FieldMapping {
  externalField: string
  internalField: string
  transform?: (value: any) => any
}
```

### 4.3 认证模块 (Auth)

```typescript
interface AuthManager {
  // 加密存储凭证
  saveCredentials(customerId: string, creds: Credentials): Promise<void>
  
  // 解密读取凭证
  getCredentials(customerId: string): Promise<Credentials>
  
  // 删除凭证
  deleteCredentials(customerId: string): Promise<void>
}

interface Credentials {
  username: string
  password: string
  phone?: string  // 用于接收验证码
}
```

### 4.4 数据层 (Database)

```sql
-- 客户系统配置
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  config_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 凭证（加密存储）
CREATE TABLE credentials (
  customer_id TEXT PRIMARY KEY,
  encrypted_data TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 外部订单（原始数据）
CREATE TABLE external_orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  raw_data JSON,
  scraped_at DATETIME,
  status TEXT
);

-- 内部订单（ERP 格式）
CREATE TABLE internal_orders (
  id TEXT PRIMARY KEY,
  external_order_id TEXT,
  mapped_data JSON,
  submitted_at DATETIME,
  erp_order_id TEXT,
  status TEXT
);

-- 字段映射规则
CREATE TABLE field_mappings (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  external_field TEXT,
  internal_field TEXT,
  transform_rule TEXT
);

-- 物料映射
CREATE TABLE material_mappings (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  external_sku TEXT,
  internal_sku TEXT,
  price_ratio REAL
);
```

---

## 5. API 设计

### 5.1 客户管理

```
GET    /api/customers          # 列表
POST   /api/customers          # 创建
GET    /api/customers/:id      # 详情
PUT    /api/customers/:id      # 更新
DELETE /api/customers/:id      # 删除
```

### 5.2 订单管理

```
GET    /api/orders/external           # 外部订单列表
POST   /api/orders/sync/:customerId   # 同步订单
GET    /api/orders/external/:id       # 外部订单详情
POST   /api/orders/:id/convert        # 转换订单
GET    /api/orders/internal           # 内部订单列表
POST   /api/orders/:id/submit         # 提交到 ERP
```

### 5.3 映射管理

```
GET    /api/mappings/fields           # 字段映射列表
POST   /api/mappings/fields           # 创建映射
GET    /api/mappings/materials        # 物料映射列表
POST   /api/mappings/materials        # 创建映射
POST   /api/mappings/materials/lookup # 快速查询
```

---

## 6. 安全设计

### 6.1 凭证加密
- 使用 AES-256 加密
- 密钥从环境变量读取（不存储）
- 加密数据仅存本地 SQLite

### 6.2 访问控制
- 应用启动可选密码保护
- 敏感操作需要二次确认

### 6.3 日志
- 记录操作历史
- 不记录敏感信息（密码、验证码）

---

## 7. 错误处理

### 7.1 爬虫错误
```typescript
enum CrawlerError {
  LOGIN_FAILED = 'LOGIN_FAILED',
  SMS_CODE_REQUIRED = 'SMS_CODE_REQUIRED',
  SELECTOR_NOT_FOUND = 'SELECTOR_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMITED = 'RATE_LIMITED'
}
```

### 7.2 映射错误
```typescript
enum MappingError {
  FIELD_NOT_MAPPED = 'FIELD_NOT_MAPPED',
  SKU_NOT_FOUND = 'SKU_NOT_FOUND',
  PRICE_MISMATCH = 'PRICE_MISMATCH',
  VALIDATION_FAILED = 'VALIDATION_FAILED'
}
```

---

## 8. 开发计划

| 阶段 | 时间 | 目标 |
|------|------|------|
| **M1 - 设计完成** | T+3 天 | UI 定稿，技术方案确认 |
| **M2 - 原型开发** | T+7 天 | 核心爬虫 + 基础界面可用 |
| **M3 - 功能完整** | T+14 天 | 映射 + 提交全流程打通 |
| **M4 - 测试发布** | T+21 天 | QA 通过，v1.0 发布 |

---

## 9. 变更历史

| 版本 | 日期 | 变更内容 | 负责人 |
|------|------|----------|--------|
| 1.0 | 2026-03-03 | 初始版本 | Backend + Frontend |
