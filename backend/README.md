# Backend - 订单转换助手

## 技术栈

- **运行时:** Node.js + TypeScript
- **Web 框架:** Express.js
- **数据库:** SQLite + Drizzle ORM
- **爬虫:** Playwright
- **加密:** crypto-js

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm test
```

## 目录结构

```
backend/
├── src/
│   ├── api/         # REST API 端点
│   ├── crawler/     # 爬虫模块
│   ├── mapper/      # 映射引擎
│   ├── auth/        # 认证/加密
│   ├── db/          # 数据库
│   └── index.ts     # 入口
├── config/          # 配置文件
└── package.json
```

## 核心模块

### 爬虫模块 (crawler/)
- 客户系统登录（处理短信验证码）
- 订单数据抓取
- 可配置的 selector 规则

### 映射引擎 (mapper/)
- 字段映射转换
- 物料/SKU 映射
- 映射规则学习

### 认证模块 (auth/)
- 凭证加密存储
- 凭证解密读取
- 密钥管理

### API 端点 (api/)
- 客户管理
- 订单管理
- 映射管理

## API 文档

详见 [API Spec](../docs/api-spec.md)

## 数据库

详见 [技术方案](../docs/technical-design.md#44-数据层 database)
