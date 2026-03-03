# Order Link - 订单转换助手

## 项目概述

协助销售人员自动化完成"外部订单 → 内部订单"的转换流程。

### 核心功能
- 🕷️ 自动登录客户订单系统（支持短信验证码）
- 📥 抓取外部订单数据
- 🔄 智能字段映射（可配置）
- 📤 自动提交内部订单系统
- 📊 订单状态追踪

### 技术栈
- **前端**：Electron + React/Vue (TBD)
- **后端**：Python/Node.js (TBD)
- **浏览器自动化**：Playwright
- **数据存储**：SQLite (本地)

## 团队角色

| 角色 | 负责人 | 职责 |
|------|--------|------|
| PM | @MacAssistant_roadmap_V26_Bot | 需求管理、进度追踪 |
| UI/UX | @Assistant_pixel_v26_Bot | 界面设计、用户体验 |
| 前端 | @Assistant_canvas_v26_Bot | 桌面应用开发 |
| 后端 | @Assistant_Backend_v26_Bot | 爬虫逻辑、数据处理 |
| QA | @Assistant_Quality_v26_Bot | 测试用例、质量保障 |
| DevOps | @pqorderbot | CI/CD、部署、基础设施 |

## 开发流程

```mermaid
graph LR
    A[需求分析] --> B[功能开发]
    B --> C[代码审查]
    C --> D[自动化测试]
    D --> E[测试环境验证]
    E --> F[生产部署]
```

## 快速开始

```bash
# 克隆项目
git clone https://github.com/orderpairs-ship-it/order_link.git
cd order_link

# 安装依赖 (TBD)
npm install / pip install -r requirements.txt

# 启动开发环境 (TBD)
npm run dev / python main.py
```

## 项目状态

🚧 **初始化阶段** - 团队组建中，工作流程制定中

---

**仓库**: https://github.com/orderpairs-ship-it/order_link.git  
**最后更新**: 2026-03-03
